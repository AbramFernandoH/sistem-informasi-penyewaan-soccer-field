'use client'
import React, { ReactNode, useEffect, useState } from 'react'
import PwaLayout from '@/layouts/pwa'
import Table from '@/components/Table'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import { fetchWithAuth, formatToRupiah, timeSlotsString } from '@/utils/helper'
import BookingBadge from '@/components/BookingBadge'
import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { ListBookingRequest, ListBookingResponse } from '@/utils/type'
import { ENV } from '@/utils/constants'
import { userProfileStore } from '@/stores/userProfile'

const Bookings = () => {
  const { user } = userProfileStore((state) => state)

  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])

  const tableHeaders = ['Lapangan', 'Tanggal', 'Waktu', 'Harga', 'Status', 'Action']

  const { data: dataListBooking, isSuccess: isSuccessListBooking } = useQuery<
    ListBookingRequest,
    unknown,
    ListBookingResponse
  >({
    queryKey: ['booking', skip],
    enabled: user !== null,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('pwa', `${ENV.API_URL}/bookings/${user?._id ?? ''}/customer?skip=${skip}`)

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
          booking.field.name,
          format(parseISO(booking.orderDate), 'd MMMM yyyy', { locale: id }),
          timeSlotsString(booking.timeSlots),
          formatToRupiah(booking.price),
          <BookingBadge
            key={`booking-status-${booking._id}`}
            status={booking.status}
          />,
          <Link
            key={booking._id}
            href={`/bookings/${booking._id}`}
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
    <PwaLayout>
      <div className='min-h-screen w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 mx-auto flex flex-col space-y-6 mt-8 lg:mt-0'>
        <h2 className='text-2xl font-bold text-gray-900 text-center lg:text-3xl mb-10'>List Booking</h2>

        <Table
          headers={tableHeaders}
          data={tableData}
          totalData={dataListBooking?.data.metadata.count ?? 0}
          currentPage={page}
          handleClickPrev={handleClickPrev}
          handleClickNext={handleClickNext}
        />
      </div>
    </PwaLayout>
  )
}

export default Bookings
