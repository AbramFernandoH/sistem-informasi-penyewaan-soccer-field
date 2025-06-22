'use client'
import React, { ReactNode, useEffect, useState } from 'react'
import PwaLayout from '@/layouts/pwa'
import DetailCardTexts from '@/components/cms/DetailCardTexts'
import Shimmer from '@/components/Shimmer'
import BookingBadge from '@/components/BookingBadge'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import { fetchWithAuth, formatToRupiah, timeSlotsString } from '@/utils/helper'
import DetailCard from '@/components/cms/DetailCard'
import { useQuery } from '@tanstack/react-query'
import { DetailBookingResponse } from '@/utils/type'
import { ENV } from '@/utils/constants'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import DetailCardTable from '@/components/cms/DetailCardTable'
import PaymentBadge from '@/components/PaymentBadge'

const BookingDetail = () => {
  const params = useParams()

  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])

  const { data: dataDetailBooking, isSuccess: isSuccessDetailBooking } = useQuery<
    unknown,
    unknown,
    DetailBookingResponse
  >({
    queryKey: ['booking', params.id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('pwa', `${ENV.API_URL}/bookings/${params.id}/detail`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get detail booking')
      }

      return res.json()
    },
  })

  const tableHeaders = ['Order Id', 'Tanggal & Waktu', 'Jumlah', 'Status']

  useEffect(() => {
    if (isSuccessDetailBooking && dataDetailBooking && dataDetailBooking.data) {
      setTableData(
        dataDetailBooking.data.payments.map((payment) => [
          payment.orderId,
          `${format(parseISO(payment.transactionTime), 'd MMMM yyyy HH:mm', { locale: id })}`,
          formatToRupiah(payment.amount),
          <PaymentBadge
            key={`status-${payment.orderId}`}
            status={payment.status}
          />,
        ])
      )
    }
  }, [isSuccessDetailBooking, dataDetailBooking])

  return (
    <PwaLayout>
      <div className='min-h-screen w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 mx-auto flex flex-col space-y-6 mt-8 lg:mt-0'>
        <h2 className='text-2xl font-bold text-gray-900 text-center lg:text-3xl mb-10'>Detail Booking</h2>

        <DetailCard title='Booking'>
          <DetailCardTexts
            wrapperClassName='flex-col lg:flex-row space-y-4 lg:space-y-0 !space-x-0 lg:justify-between'
            data={[
              {
                label: 'Tanggal Pemesanan',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    format(parseISO(dataDetailBooking.data.orderDate), 'd MMMM yyyy', { locale: id })
                  ) : (
                    <Shimmer className='h-5 w-full' />
                  ),
              },
              {
                label: 'Waktu',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    timeSlotsString(dataDetailBooking.data.timeSlots)
                  ) : (
                    <Shimmer className='h-5 w-full' />
                  ),
              },
              {
                label: 'Total Harga',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    formatToRupiah(dataDetailBooking.data.price)
                  ) : (
                    <Shimmer className='h-5 w-full' />
                  ),
              },
              {
                label: 'Status',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    <BookingBadge status={dataDetailBooking.data.status} />
                  ) : (
                    <Shimmer className='h-6 w-[70px]' />
                  ),
              },
            ]}
          />
        </DetailCard>

        <DetailCard
          title='Lapangan'
          detailWrapperClassName='!space-y-4 lg:space-y-8'
        >
          <DetailCardTexts
            data={[
              {
                label: 'Nama lapangan',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    dataDetailBooking.data.field.name
                  ) : (
                    <Shimmer className='h-5 w-full' />
                  ),
              },
            ]}
          />

          <DetailCardTexts
            data={[
              {
                label: 'Foto lapangan',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    <Link
                      href={dataDetailBooking.data.field.photo}
                      target='_blank'
                    >
                      <img
                        src={dataDetailBooking.data.field.photo}
                        alt={`Foto ${dataDetailBooking.data.field.name}`}
                      />
                    </Link>
                  ) : (
                    <Shimmer className='h-5 w-full' />
                  ),
              },
            ]}
          />
        </DetailCard>

        <DetailCard title='Pembayaran'>
          <DetailCardTable
            headers={tableHeaders}
            data={tableData}
          />
        </DetailCard>

        {dataDetailBooking &&
          dataDetailBooking.data.status === 'failure' &&
          dataDetailBooking.data.refundStatus === 'refunded_manually' && (
            <DetailCard title='Refund'>
              <DetailCardTexts
                data={[
                  {
                    label: 'Catatan',
                    value: dataDetailBooking.data.refundNote,
                  },
                ]}
              />

              <DetailCardTexts
                data={[
                  {
                    label: 'Bukti refund',
                    value:
                      dataDetailBooking.data.refundProof !== null ? (
                        <Link
                          href={dataDetailBooking.data.refundProof}
                          target='_blank'
                        >
                          <img
                            src={dataDetailBooking.data.refundProof}
                            alt='Foto bukti refund'
                            draggable={false}
                          />
                        </Link>
                      ) : (
                        '-'
                      ),
                  },
                ]}
              />
            </DetailCard>
          )}
      </div>
    </PwaLayout>
  )
}

export default BookingDetail
