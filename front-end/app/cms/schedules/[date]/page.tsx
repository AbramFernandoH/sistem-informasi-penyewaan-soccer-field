'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import { EyeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { id as indonesianLocale } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { fetchWithAuth } from '@/utils/helper'
import { ListFieldRequest, ListFieldResponse } from '@/utils/type'
import { ENV } from '@/utils/constants'
import { ReactNode, useEffect, useState } from 'react'

export default function ScheduleFields() {
  const params = useParams()

  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Jadwal', path: '/cms/schedules', current: false },
    { name: format(String(params.date), 'd MMMM yyyy', { locale: indonesianLocale }), path: '/', current: true },
  ]
  const tableHeaders = ['Nama Lapangan', 'Action']

  const { data, isSuccess } = useQuery<ListFieldRequest, unknown, ListFieldResponse>({
    queryKey: ['schedule', skip],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/fields?skip=${skip}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get schedule')
      }

      return res.json()
    },
  })

  const handleClickPrev = () => {
    setSkip(skip > 0 ? skip - 10 : 0)
    setPage(page > 1 ? page - 1 : 1)
  }

  const handleClickNext = () => {
    setSkip(skip + 10)
    setPage(page + 1)
  }

  useEffect(() => {
    if (isSuccess) {
      setTableData(
        data.data.items.map((item) => [
          item.name,
          <Link
            key={item._id}
            href={`/cms/schedules/${params.date}/${item._id}`}
            className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            <EyeIcon className='size-3' />

            <span>Lihat Jadwal</span>
          </Link>,
        ])
      )
    }
  }, [data?.data.items, isSuccess, params.date])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Table
        title='List Lapangan'
        description='lihat jadwal perlapangan untuk tanggal yang dipilih'
        headers={tableHeaders}
        data={tableData}
        totalData={data?.data.metadata.count ?? 0}
        currentPage={page}
        handleClickPrev={handleClickPrev}
        handleClickNext={handleClickNext}
      />
    </CMSLayout>
  )
}
