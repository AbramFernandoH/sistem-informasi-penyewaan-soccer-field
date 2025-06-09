'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { PencilIcon } from '@heroicons/react/24/outline'

export default function Reports() {
  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Laporan', path: '/cms/reports', current: true }]
  const tableHeaders = ['Nama', 'Jenis', 'Jumlah', 'Action']

  const tableData = [
    [
      'Maintenance Rumput',
      'Pengeluaran',
      'Rp 1.000.000',
      <Link
        key={1}
        href={`/cms/reports/report-1/edit`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <PencilIcon className='size-3' />

        <span>Edit</span>
      </Link>,
    ],
    [
      'Sewa lapangan 2 - 2 Juni 2025 - 13:00 - 15:00',
      'Pemasukan',
      'Rp 300.000',
      <Link
        key={2}
        href={`/cms/reports/report-2/edit`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <PencilIcon className='size-3' />

        <span>Edit</span>
      </Link>,
    ],
    [
      'Listrik bulan Mei 2025',
      'Pengeluaran',
      'Rp 5.000.000',
      <Link
        key={3}
        href={`/cms/admins/report-3/edit`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <PencilIcon className='size-3' />

        <span>Edit</span>
      </Link>,
    ],
  ]

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Table
        title='List Laporan'
        description='list manajemen laporan'
        addButton={{
          path: '/cms/reports/create',
        }}
        headers={tableHeaders}
        data={tableData}
      />
    </CMSLayout>
  )
}
