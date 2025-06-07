'use client'

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  format,
  isSameMonth,
  isSameDay,
} from 'date-fns'
import { id as indonesianLocale } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function MonthlyCalendar() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())

  const startDate = startOfWeek(startOfMonth(currentDate), {
    weekStartsOn: 0,
  })
  const endDate = endOfWeek(endOfMonth(currentDate), {
    weekStartsOn: 0,
  })

  const generateDates = () => {
    const weeks = []
    let date = startDate

    while (date <= endDate) {
      const week = []

      for (let i = 0; i < 7; i++) {
        week.push(date)
        date = addDays(date, 1)
      }

      weeks.push(week)
    }

    return weeks
  }

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handlePrevYear = () => {
    setCurrentDate(subYears(currentDate, 1))
  }

  const handleNextYear = () => {
    setCurrentDate(addYears(currentDate, 1))
  }

  const handleDateClick = (date: Date) => {
    const formatted = format(date, 'yyyy-MM-dd')
    router.push(`/cms/schedules/${formatted}`)
  }

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  const desktopDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const mobileDays = ['M', 'S', 'S', 'R', 'K', 'J', 'S']
  const weeks = generateDates()

  return (
    <div className='space-y-4 rounded-lg border p-4 shadow-sm'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-5 lg:px-7'>
        <div className='flex items-center justify-between min-w-[160px]'>
          <button onClick={handlePrevMonth}>
            <ChevronLeftIcon className='h-5 w-5' />
          </button>
          <h2 className='text-lg font-semibold'>{format(currentDate, 'MMMM', { locale: indonesianLocale })}</h2>
          <button onClick={handleNextMonth}>
            <ChevronRightIcon className='h-5 w-5' />
          </button>
        </div>

        <div className='flex items-center justify-between min-w-[160px]'>
          <button onClick={handlePrevYear}>
            <ChevronLeftIcon className='h-4 w-4' />
          </button>
          <span className='text-md font-semibold'>{format(currentDate, 'yyyy')}</span>
          <button onClick={handleNextYear}>
            <ChevronRightIcon className='h-4 w-4' />
          </button>
        </div>
      </div>

      <div className='flex items-center space-x-1 text-center text-sm font-medium text-gray-500'>
        {desktopDays.map((day, idx) => (
          <div
            key={`${day}-${idx}`}
            className='hidden lg:block w-full px-2'
          >
            {day}
          </div>
        ))}

        {mobileDays.map((day, idx) => (
          <div
            key={`${day}-${idx}`}
            className='lg:hidden w-full px-2'
          >
            {day}
          </div>
        ))}
      </div>

      <div className='flex flex-col items-center space-y-1'>
        {weeks.map((week, idx) => (
          <div
            key={`week-${idx + 1}`}
            className='flex items-center space-x-1 text-sm w-full'
          >
            {week.map((date) => {
              const isCurrentMonth = isSameMonth(date, currentDate)
              const isToday = isSameDay(date, new Date())
              return (
                <button
                  key={date.toString()}
                  onClick={() => handleDateClick(date)}
                  className={classNames(
                    'rounded p-2 text-center w-full min-h-14 lg:min-h-24',
                    isToday ? 'bg-blue-500 text-white' : '',
                    !isCurrentMonth ? 'text-gray-300' : '',
                    isCurrentMonth && !isToday ? 'hover:bg-gray-100' : ''
                  )}
                >
                  {format(date, 'd')}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
