import { COOKIES, ENV } from '@/utils/constants'
import { BaseResponse } from '@/utils/type'

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

export async function fetchWithAuth(role: 'cms' | 'pwa', input: RequestInfo, init?: RequestInit): Promise<Response> {
  const accessToken = getCookie(role === 'cms' ? COOKIES.ADMIN_ACCESS_TOKEN : COOKIES.USER_ACCESS_TOKEN)
  const refreshToken = getCookie(role === 'cms' ? COOKIES.ADMIN_REFRESH_TOKEN : COOKIES.USER_REFRESH_TOKEN)

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
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
            ...(init?.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json',
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
