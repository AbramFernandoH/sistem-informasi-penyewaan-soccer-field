'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { SCHEDULE_COLORS, timeSlots } from '@/utils/constants'
import { FC } from 'react'
import { Schedule } from '@/utils/type'

type DayCalendarProps = {
  schedules: Schedule[]
}

const DayCalendar: FC<DayCalendarProps> = ({ schedules }) => {
  const params = useParams()

  return (
    <>
      <header className='flex flex-none items-center justify-between border-b border-gray-400 px-6 py-4'>
        <div>
          <h1 className='text-base font-semibold text-gray-900'>
            {format(String(params.date), 'EEEE, d MMMM yyyy', { locale: id })}
          </h1>
        </div>

        <Link
          href={`/cms/schedules/create?date=${params.date ?? ''}&field=${params.fieldId ?? ''}`}
          className='flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          <PlusIcon className='size-5' />

          <span>Tambah</span>
        </Link>
      </header>

      <div className='flex h-full flex-col border-b border-gray-400'>
        <div className='isolate flex flex-auto overflow-hidden bg-white'>
          <div className='flex h-[calc(100vh-300px)] overflow-auto'>
            {/* Times */}
            <div className='flex flex-col w-12 lg:w-16'>
              <div className='min-h-12 max-h-12 bg-white text-right text-xs/5 text-gray-400 p-2 border-b border-solid border-b-indigo-200' />

              {Array.from({ length: 15 }).map((_, idx) => (
                <div
                  key={idx}
                  className='min-h-24 max-h-24 bg-white text-right text-xs/5 text-gray-400 p-2 border-b border-solid border-b-indigo-200'
                >
                  <p>{`${7 + idx < 10 ? '0' : ''}${7 + idx}:00`}</p>
                </div>
              ))}

              <div className='min-h-12 max-h-12 bg-white text-right text-xs/5 text-gray-400 p-2 border-b border-solid border-b-indigo-200'>
                <p>22:00</p>
              </div>
            </div>

            {/* Schedules */}
            <div className='flex flex-col w-[calc(100vw-80px)] lg:w-[calc(100vw-120px)] relative'>
              <div className='min-h-12 max-h-12 w-full border-l border-b border-solid border-l-grey-200 border-b-indigo-200' />

              {Array.from({ length: 15 }).map((_, idx) => (
                <div
                  key={idx}
                  className='min-h-24 max-h-24 w-full border-l border-b border-solid border-l-grey-200 border-b-indigo-200'
                ></div>
              ))}

              <div className='min-h-12 max-h-12 w-full border-l border-b border-solid border-l-grey-200 border-b-indigo-200' />

              {schedules.map((schedule, idx) => (
                <Link
                  key={schedule._id}
                  href={`/cms/schedules/${String(params.date)}/${String(params.fieldId)}/${schedule._id}/edit`}
                  className='group absolute inset-x-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs/5 h-[94px]'
                  style={{
                    backgroundColor: SCHEDULE_COLORS[idx].card,
                    color: SCHEDULE_COLORS[idx].text,
                    top: `${48 + schedule.timeSlots[0] * 96}px`,
                    height: `${schedule.timeSlots.length * 96 - 2}px`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = SCHEDULE_COLORS[idx].hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = SCHEDULE_COLORS[idx].card)}
                >
                  <p className='order-1 font-semibold'>{schedule.reason}</p>

                  <p>
                    {String(timeSlots[schedule.timeSlots[0]]).split('-')[0]}-
                    {String(timeSlots[schedule.timeSlots[schedule.timeSlots.length - 1]]).split('-')[1]}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DayCalendar
