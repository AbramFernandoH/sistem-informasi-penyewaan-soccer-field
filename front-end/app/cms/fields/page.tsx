'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { PencilIcon } from '@heroicons/react/24/outline'

export default function Field() {
  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Lapangan', path: '/cms/fields', current: true }]
  const tableHeaders = ['Nama Lapangan', 'Harga', 'Action']

  const tableData = [
    [
      'Lapangan 1',
      'Rp 150.000',
      <Link
        key={1}
        href={`/cms/fields/lapangan-1/edit`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <PencilIcon className='size-3' />

        <span>Edit</span>
      </Link>,
    ],
    [
      'Lapangan 2',
      'Rp 150.000',
      <Link
        key={2}
        href={`/cms/fields/lapangan-2/edit`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <PencilIcon className='size-3' />

        <span>Edit</span>
      </Link>,
    ],
    [
      'Lapangan 3',
      'Rp 150.000',
      <Link
        key={3}
        href={`/cms/fields/lapangan-3/edit`}
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
        title='List Lapangan'
        description='list manajemen lapangan'
        addButton={{
          path: '/cms/fields/create',
        }}
        headers={tableHeaders}
        data={tableData}
      />
    </CMSLayout>
  )
}
