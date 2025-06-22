import { COOKIES, ENV, timeSlots } from '@/utils/constants'
import { BaseResponse } from '@/utils/type'
import { KeyboardEvent } from 'react'
import { formatCurrency } from '@/utils/formatter'
import { differenceInCalendarDays, isBefore, isToday, parse, parseISO, startOfDay } from 'date-fns'

// Set a cookie with a name, value, and expiration in days
export const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString() // days → milliseconds
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

// Get a cookie by name
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    const lastPart = parts.pop()
    const cookieValue = lastPart?.split(';')[0]

    return cookieValue ? decodeURIComponent(cookieValue) : null
  }

  return null
}

// delete a cookie
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/;`
}

let isRefreshing = false

type RefreshTokenResponse = BaseResponse<{
  accessToken: string
  refreshToken: string
}>

// fetch authentication that hit refresh if there is no access token
export async function fetchWithAuth(role: 'cms' | 'pwa', input: RequestInfo, init?: RequestInit): Promise<Response> {
  const accessToken = getCookie(role === 'cms' ? COOKIES.ADMIN_ACCESS_TOKEN : COOKIES.USER_ACCESS_TOKEN)
  const refreshToken = getCookie(role === 'cms' ? COOKIES.ADMIN_REFRESH_TOKEN : COOKIES.USER_REFRESH_TOKEN)

  const isFormData = init?.body instanceof FormData

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers || {}),
    },
  })

  // Access token expired
  if (response.status === 401 && !isRefreshing) {
    try {
      if (accessToken === null && refreshToken !== null) {
        // Prevent multiple simultaneous refreshes
        isRefreshing = true

        const body = {
          refreshToken: refreshToken ?? '',
        }

        const refreshResponse = await fetch(`${ENV.API_URL}/${role === 'pwa' ? 'auth' : 'auth-admin'}/refresh`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })

        const data: RefreshTokenResponse = await refreshResponse.json()

        setCookie(role === 'cms' ? COOKIES.ADMIN_ACCESS_TOKEN : COOKIES.USER_ACCESS_TOKEN, data.data.accessToken, 1)
        setCookie(role === 'cms' ? COOKIES.ADMIN_REFRESH_TOKEN : COOKIES.USER_REFRESH_TOKEN, data.data.refreshToken, 7)

        isRefreshing = false

        // Retry original request with new access token
        const newAccessToken = getCookie(role === 'cms' ? COOKIES.ADMIN_ACCESS_TOKEN : COOKIES.USER_ACCESS_TOKEN)
        return fetch(input, {
          ...init,
          headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            Authorization: `Bearer ${newAccessToken}`,
            ...(init?.headers || {}),
          },
        })
      }
    } catch {
      isRefreshing = false
      throw new Error('Session expired')
    }
  }

  return response
}

// only allow number to type
export const allowOnlyNumbers = (e: KeyboardEvent<HTMLInputElement>) => {
  const key = e.key

  // Allow: Backspace, Tab, Arrow keys, Delete
  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete']

  if (
    !/^[0-9]$/.test(key) && // not a number
    !allowedKeys.includes(key) // not a control key
  ) {
    e.preventDefault()
  }
}

export const formatToRupiah = (amount: number) => 'Rp ' + amount.toLocaleString('id-ID')

export const cleanNumber = (value: string) => Number(String(value).replace(/[,.]/g, ''))

export const addDotsToNumber = (value: string | number) =>
  formatCurrency(Number(String(value).replace(/[,.]/g, '')), {})

export const isSequential = (arr: number[]) => {
  if (arr.length < 2) return true
  const sorted = [...arr].sort((a, b) => a - b)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) return false
  }

  return true
}

export const isTimeSlotExpired = (slotIndex: number, selectedDate: string) => {
  const now = new Date()
  const isSelectedDateToday = isToday(new Date(selectedDate))

  if (!isSelectedDateToday) return false

  const endTimeStr = timeSlots[slotIndex].split(' - ')[1] // e.g., '08:00'
  const endTime = parse(endTimeStr, 'HH:mm', new Date()) // today at 08:00
  return isBefore(endTime, now)
}

export const timeSlotsString = (time: number[]) => {
  const startTime = timeSlots[time[0]].split(' - ')[0]

  if (time.length > 1) {
    const endTime = timeSlots[time[time.length - 1]].split(' - ')[1]

    return `${startTime} - ${endTime}`
  }

  const endTime = timeSlots[time[0]].split(' - ')[1]

  return `${startTime} - ${endTime}`
}

export const hasTimeSlotEnded = (orderDate: string, selectedSlots: number[]) => {
  if (!selectedSlots || selectedSlots.length === 0) return false

  const lastSlotIndex = Math.max(...selectedSlots)
  const slotRange = timeSlots[lastSlotIndex]
  const endTime = slotRange.split(' - ')[1] // e.g. '22:00'

  const datePart = orderDate.split('T')[0] // e.g. '2025-06-25'
  const combinedDateTimeString = `${datePart} ${endTime}`

  const endDateTime = parse(combinedDateTimeString, 'yyyy-MM-dd HH:mm', new Date())
  const now = new Date()

  return isBefore(now, endDateTime)
}

export const isThreeDaysOrMoreInFuture = (selectedIso: string) => {
  const selectedDate = startOfDay(parseISO(selectedIso))
  const currentDate = startOfDay(parseISO(new Date().toISOString()))

  return differenceInCalendarDays(selectedDate, currentDate) >= 3
}
