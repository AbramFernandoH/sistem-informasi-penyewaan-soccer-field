'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import { fetchWithAuth, formatToRupiah, timeSlotsString } from '@/utils/helper'
import { useQuery } from '@tanstack/react-query'
import { ReactNode, useEffect, useState } from 'react'
import { ListBookingRequest, ListBookingResponse } from '@/utils/type'
import { ENV } from '@/utils/constants'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'
import BookingBadge from '@/components/BookingBadge'

export default function Payments() {
  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])

  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Booking', path: '/cms/bookings', current: true }]
  const tableHeaders = ['Nama Penyewa', 'Tanggal', 'Waktu', 'Lapangan', 'Harga', 'Status', 'Action']

  const { data: dataListBooking, isSuccess: isSuccessListBooking } = useQuery<
    ListBookingRequest,
    unknown,
    ListBookingResponse
  >({
    queryKey: ['booking', skip],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/bookings?skip=${skip}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list booking')
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
    if (isSuccessListBooking && dataListBooking && dataListBooking.data) {
      setTableData(
        dataListBooking.data.items.map((booking) => [
          <div
            key={`name-${booking._id}`}
            className='max-w-[200px] w-full'
          >
            <p
              title={booking.name}
              className='truncate'
            >
              {booking.name}
            </p>
          </div>,
          format(parseISO(booking.orderDate), 'd MMMM yyyy', { locale: id }),
          timeSlotsString(booking.timeSlots),
          booking.field.name,
          formatToRupiah(booking.price),
          <BookingBadge
            key={`booking-status-${booking._id}`}
            status={booking.status}
          />,
          <Link
            key={booking._id}
            href={`/cms/bookings/${booking._id}`}
            className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            <EyeIcon className='size-3' />

            <span>Detail</span>
          </Link>,
        ])
      )
    }
  }, [isSuccessListBooking, dataListBooking])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Table
        title='List Booking'
        description='list manajemen booking'
        emptyStateText='Belum ada customer yang melakukan booking'
        headers={tableHeaders}
        data={tableData}
        totalData={dataListBooking?.data.metadata.count ?? 0}
        currentPage={page}
        handleClickPrev={handleClickPrev}
        handleClickNext={handleClickNext}
      />
    </CMSLayout>
  )
}
