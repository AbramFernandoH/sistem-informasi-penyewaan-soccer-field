'use client'

import { useEffect, useRef } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function DayCalendar() {
  const params = useParams()

  const container = useRef<HTMLDivElement | null>(null)
  const containerOffset = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60

    if (container.current !== null && containerOffset.current !== null) {
      container.current.scrollTop =
        ((container.current.scrollHeight - containerOffset.current.offsetHeight - 180) * currentMinute) / 1440
    }
  }, [])

  return (
    <>
      <header className='flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4'>
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

      <div className='flex h-full flex-col'>
        <div className='isolate flex flex-auto overflow-hidden bg-white'>
          <div
            ref={container}
            className='flex flex-auto flex-col max-h-[calc(100vh-300px)] overflow-auto'
          >
            <div className='flex w-full flex-auto'>
              <div className='w-14 flex-none bg-white ring-1 ring-gray-100' />
              <div className='grid flex-auto grid-cols-1 grid-rows-1'>
                {/* Horizontal lines */}
                <div
                  className='col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100'
                  style={{ gridTemplateRows: 'repeat(32, minmax(3.5rem, 1fr))' }}
                >
                  <div
                    ref={containerOffset}
                    className='row-end-1 h-7'
                  ></div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>7AM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>8AM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>9AM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>
                      10AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>
                      11AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>
                      12PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>1PM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>2PM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>3PM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>4PM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>5PM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>6PM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>7PM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>8PM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>9PM</div>
                  </div>
                  <div />
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400'>
                      10PM
                    </div>
                  </div>
                  <div />
                </div>

                <ol
                  className='col-start-1 col-end-2 row-start-1 grid grid-cols-1'
                  style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
                >
                  <li
                    className='relative mt-px flex'
                    style={{ gridRow: '10 / span 12' }}
                  >
                    <a
                      href='#'
                      className='group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs/5 hover:bg-blue-100'
                    >
                      <p className='order-1 font-semibold text-blue-700'>Breakfast</p>
                      <p className='text-blue-500 group-hover:text-blue-700'>
                        <time dateTime='2022-01-22T06:00'>6:00 AM</time>
                      </p>
                    </a>
                  </li>
                  <li
                    className='relative mt-px flex'
                    style={{ gridRow: '92 / span 30' }}
                  >
                    <a
                      href='#'
                      className='group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs/5 hover:bg-pink-100'
                    >
                      <p className='order-1 font-semibold text-pink-700'>Flight to Paris</p>
                      <p className='order-1 text-pink-500 group-hover:text-pink-700'>
                        John F. Kennedy International Airport
                      </p>
                      <p className='text-pink-500 group-hover:text-pink-700'>
                        <time dateTime='2022-01-22T07:30'>7:30 AM</time>
                      </p>
                    </a>
                  </li>
                  <li
                    className='relative mt-px flex'
                    style={{ gridRow: '134 / span 18' }}
                  >
                    <a
                      href='#'
                      className='group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-indigo-50 p-2 text-xs/5 hover:bg-indigo-100'
                    >
                      <p className='order-1 font-semibold text-indigo-700'>Sightseeing</p>
                      <p className='order-1 text-indigo-500 group-hover:text-indigo-700'>Eiffel Tower</p>
                      <p className='text-indigo-500 group-hover:text-indigo-700'>
                        <time dateTime='2022-01-22T11:00'>11:00 AM</time>
                      </p>
                    </a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
