'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'
import { timeSlotsString } from '@/utils/helper'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export default function Payments() {
  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Booking', path: '/cms/bookings', current: true }]
  const tableHeaders = ['Nama Penyewa', 'Tanggal', 'Waktu', 'Lapangan', 'Harga', 'Status', 'Action']

  const tableData = [
    [
      'Salahuddin Nabil',
      format(parseISO('2025-06-18T00:00:00.000Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([0, 1]),
      'Lapangan 1',
      'Rp 300.000',
      <div
        key={1}
        className='bg-red-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit'
      >
        Failure
      </div>,
      <Link
        key={1}
        href={`/cms/bookings/booking-1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Dimastri Bima',
      format(parseISO('2025-06-19T00:00:00.000Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([9, 10]),
      'Lapangan 1',
      'Rp 300.000',
      <div
        key={2}
        className='bg-orange-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit'
      >
        Pending
      </div>,
      <Link
        key={2}
        href={`/cms/bookings/booking-2`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'Abram Fernando',
      format(parseISO('2025-12-20T00:00:00.000Z'), 'd MMMM yyyy', { locale: id }),
      timeSlotsString([11, 13]),
      'Lapangan 1',
      'Rp 300.000',
      <div
        key={3}
        className='bg-green-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit'
      >
        Success
      </div>,
      <Link
        key={3}
        href={`/cms/bookings/booking-3`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
  ]

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Table
        title='List Booking'
        description='list manajemen booking'
        headers={tableHeaders}
        data={tableData}
      />
    </CMSLayout>
  )
}
