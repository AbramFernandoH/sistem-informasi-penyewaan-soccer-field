'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { PencilIcon } from '@heroicons/react/24/outline'

export default function Admin() {
  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Admin', path: '/cms/admins', current: true }]
  const tableHeaders = ['Nama', 'Email', 'Action']

  const tableData = [
    [
      'Admin1',
      'admin1@mail.com',
      <Link
        key={1}
        href={`/cms/admins/admin-1/edit`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <PencilIcon className='size-3' />

        <span>Edit</span>
      </Link>,
    ],
    [
      'Admin2',
      'admin2@mail.com',
      <Link
        key={2}
        href={`/cms/admins/admin-2/edit`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <PencilIcon className='size-3' />

        <span>Edit</span>
      </Link>,
    ],
    [
      'Admin3',
      'admin3@mail.com',
      <Link
        key={3}
        href={`/cms/admins/admin-3/edit`}
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
        title='List Admin'
        description='list manajemen admin'
        addButton={{
          path: '/cms/admins/create',
        }}
        headers={tableHeaders}
        data={tableData}
      />
    </CMSLayout>
  )
}
