'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { PencilIcon } from '@heroicons/react/24/outline'
import { ReactNode, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ListAdminRequest, ListAdminResponse } from '@/utils/type'
import { fetchWithAuth } from '@/utils/helper'
import { ENV } from '@/utils/constants'

export default function Admin() {
  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])

  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Admin', path: '/cms/admins', current: true }]
  const tableHeaders = ['Nama Lengkap', 'Username', 'Action']

  const { data, isSuccess } = useQuery<ListAdminRequest, unknown, ListAdminResponse>({
    queryKey: ['admin', skip],
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/admins?skip=${skip}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list admin')
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
          item.fullName,
          item.username,
          <Link
            key={item._id}
            href={`/cms/admins/${item.username}/edit`}
            className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            <PencilIcon className='size-3' />

            <span>Edit</span>
          </Link>,
        ])
      )
    }
  }, [data?.data.items, isSuccess])

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
        totalData={data?.data.metadata.count ?? 0}
        currentPage={page}
        handleClickPrev={handleClickPrev}
        handleClickNext={handleClickNext}
      />
    </CMSLayout>
  )
}
