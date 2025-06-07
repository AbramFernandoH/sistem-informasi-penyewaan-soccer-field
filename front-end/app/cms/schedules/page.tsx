'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import MonthlyCalendar from '@/components/cms/MonthlyCalendar'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Field() {
  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Jadwal', path: '/cms/schedules', current: true }]

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <div className='flex flex-col space-y-8'>
        <div className='flex items-center justify-between'>
          <div className='flex-auto'>
            <h1 className='text-2xl font-semibold text-gray-900'>List Jadwal</h1>

            <p className='mt-2 text-base text-gray-700'>pilih tanggal untuk melihat jadwal</p>
          </div>

          <Link
            href='/cms/schedules/create'
            className='flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            <PlusIcon className='size-5' />

            <span>Tambah</span>
          </Link>
        </div>

        <MonthlyCalendar />
      </div>
    </CMSLayout>
  )
}
