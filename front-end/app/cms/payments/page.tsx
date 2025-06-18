'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'

export default function Payments() {
  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Pembayaran', path: '/cms/payments', current: true }]
  const tableHeaders = ['Order Id', 'Tanggal & Waktu', 'Jumlah', 'User', 'Status', 'Action']

  const tableData = [
    [
      'order-1',
      '18 Juni 2025 17:00',
      'Rp 1.000.000',
      '-',
      <div
        key={1}
        className='bg-red-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit'
      >
        Failure
      </div>,
      <Link
        key={1}
        href={`/cms/payments/payment-1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'order-2',
      '18 Juni 2025 17:00',
      'Rp 300.000',
      'Fernando',
      <div
        key={2}
        className='bg-orange-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit'
      >
        Pending
      </div>,
      <Link
        key={2}
        href={`/cms/payments/payment-2`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'order-3',
      '18 Juni 2025 17:00',
      'Rp 5.000.000',
      'Abram',
      <div
        key={3}
        className='bg-green-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit'
      >
        Success
      </div>,
      <Link
        key={3}
        href={`/cms/payments/payment-3`}
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
        title='List Pembayaran'
        description='list manajemen pembayaran'
        headers={tableHeaders}
        data={tableData}
      />
    </CMSLayout>
  )
}
