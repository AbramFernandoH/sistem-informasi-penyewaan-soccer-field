import React from 'react'
import PwaLayout from '@/layouts/pwa'
import Table from '@/components/Table'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import { formatToRupiah, timeSlotsString } from '@/utils/helper'
import BookingBadge from '@/components/BookingBadge'
import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'

const Bookings = () => {
  const tableHeaders = ['Lapangan', 'Tanggal', 'Waktu', 'Harga', 'Status', 'Action']
  const tableData = [
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Lapangan 1',
      format(parseISO('2025-06-21T10:13:50.126Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([7, 8]),
      formatToRupiah(250000),
      <BookingBadge
        key={`booking-status-1`}
        status='fully_paid'
      />,
      <Link
        key={1}
        href={`/bookings/1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
  ]

  return (
    <PwaLayout>
      <div className='min-h-screen w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 mx-auto flex flex-col space-y-6 mt-8 lg:mt-0'>
        <h2 className='text-2xl font-bold text-gray-900 text-center lg:text-3xl mb-10'>Booking Saya</h2>

        <Table
          headers={tableHeaders}
          data={tableData}
        />
      </div>
    </PwaLayout>
  )
}

export default Bookings
