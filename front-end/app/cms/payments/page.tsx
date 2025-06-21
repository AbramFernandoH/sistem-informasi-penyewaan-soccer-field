'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { ListPaymentResponse } from '@/utils/type'
import { fetchWithAuth, formatToRupiah } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import { ReactNode, useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import PaymentBadge from '@/components/PaymentBadge'

export default function Payments() {
  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])

  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Pembayaran', path: '/cms/payments', current: true }]
  const tableHeaders = ['Order Id', 'Tanggal & Waktu', 'Jumlah', 'User', 'Status', 'Action']

  const { data: dataListPayment, isSuccess: isSuccessListPayment } = useQuery<unknown, unknown, ListPaymentResponse>({
    queryKey: ['payment', skip],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/payments?skip=${skip}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list payment')
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
    if (isSuccessListPayment && dataListPayment && dataListPayment.data) {
      setTableData(
        dataListPayment.data.items.map((payment) => [
          payment.orderId,
          `${format(parseISO(payment.transactionTime), 'd MMMM yyyy HH:mm', { locale: id })}`,
          formatToRupiah(payment.amount),
          payment.user !== null ? payment.user.fullName : '-',
          <PaymentBadge
            key={`status-${payment.orderId}`}
            status={payment.status}
          />,
          <div
            key={`action-${payment.orderId}`}
            className='flex items-center space-x-3'
          >
            <Link
              href={`/cms/payments/${payment._id}`}
              className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              <EyeIcon className='size-3' />

              <span>Detail</span>
            </Link>
          </div>,
        ])
      )
    }
  }, [isSuccessListPayment, dataListPayment])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Table
        title='List Pembayaran'
        description='list manajemen pembayaran'
        headers={tableHeaders}
        data={tableData}
        totalData={dataListPayment?.data.metadata.count ?? 0}
        currentPage={page}
        handleClickPrev={handleClickPrev}
        handleClickNext={handleClickNext}
      />
    </CMSLayout>
  )
}
