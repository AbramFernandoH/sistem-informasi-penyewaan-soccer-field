'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import { EyeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { id as indonesianLocale } from 'date-fns/locale'

export default function Field() {
  const params = useParams()

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Jadwal', path: '/cms/schedules', current: false },
    { name: format(String(params.date), 'd MMMM yyyy', { locale: indonesianLocale }), path: '/', current: true },
  ]
  const tableHeaders = ['Nama Lapangan', 'Action']

  const tableData = [
    [
      'Lapangan 1',
      <Link
        key={1}
        href={`/cms/schedules/${params.date}/lapangan-1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Lihat Jadwal</span>
      </Link>,
    ],
    [
      'Lapangan 2',
      <Link
        key={2}
        href={`/cms/schedules/${params.date}/lapangan-2`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Lihat Jadwal</span>
      </Link>,
    ],
    [
      'Lapangan 3',
      <Link
        key={3}
        href={`/cms/schedules/${params.date}/lapangan-3`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Lihat Jadwal</span>
      </Link>,
    ],
  ]

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Table
        title='List Lapangan'
        description='lihat jadwal perlapangan untuk tanggal yang dipilih'
        headers={tableHeaders}
        data={tableData}
      />
    </CMSLayout>
  )
}
