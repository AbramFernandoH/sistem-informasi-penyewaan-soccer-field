'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import { useParams } from 'next/navigation'
import Header from '@/components/cms/Header'
import DetailCardTexts from '@/components/cms/DetailCardTexts'
import Shimmer from '@/components/Shimmer'
import BookingBadge from '@/components/BookingBadge'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import { fetchWithAuth, formatToRupiah, timeSlotsString } from '@/utils/helper'
import DetailCard from '@/components/cms/DetailCard'
import { useQuery } from '@tanstack/react-query'
import { DetailPaymentResponse } from '@/utils/type'
import { ENV } from '@/utils/constants'
import PaymentBadge from '@/components/PaymentBadge'

export default function DetailPayment() {
  const params = useParams()

  const { data: dataDetailPayment, isSuccess: isSuccessDetailPayment } = useQuery<
    unknown,
    unknown,
    DetailPaymentResponse
  >({
    queryKey: ['payment', params.id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/payments/${params.id}/detail`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get detail payment')
      }

      return res.json()
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Pembayaran', path: '/cms/payments', current: false },
    { name: 'Detail Pembayaran', path: '/', current: true },
  ]

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Detail Pembayaran'
        backUrl='/cms/payments'
      />

      <DetailCard title='Info Pembayaran'>
        <DetailCardTexts
          innerWrapperClassName='!w-[400px]'
          data={[
            {
              label: 'Order Id',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  <p className='text-2xl font-bold text-indigo-500 break-all min-w-[400px]'>
                    {dataDetailPayment.data.orderId}
                  </p>
                ) : (
                  <Shimmer className='h-8 w-full' />
                ),
            },
            {
              label: 'Status',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  <PaymentBadge status={dataDetailPayment.data.status} />
                ) : (
                  <Shimmer className='h-6 w-[70px]' />
                ),
            },
          ]}
        />

        <DetailCardTexts
          data={[
            {
              label: 'Jumlah',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  formatToRupiah(dataDetailPayment.data.amount)
                ) : (
                  <Shimmer className='h-5 w-full' />
                ),
            },
            {
              label: 'Tanggal Pemesanan',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  format(parseISO(dataDetailPayment.data.transactionTime), 'd MMMM yyyy', { locale: id })
                ) : (
                  <Shimmer className='h-5 w-full' />
                ),
            },
          ]}
        />
      </DetailCard>

      <DetailCard title='Info Booking'>
        <DetailCardTexts
          data={[
            {
              label: 'Nama Penyewa',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  dataDetailPayment.data.booking.name
                ) : (
                  <Shimmer className='h-5 w-full' />
                ),
            },
            {
              label: 'Email',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  dataDetailPayment.data.booking.email
                ) : (
                  <Shimmer className='h-5 w-full' />
                ),
            },
            {
              label: 'No. Telepon',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  dataDetailPayment.data.booking.telephoneNumber
                ) : (
                  <Shimmer className='h-5 w-full' />
                ),
            },
            {
              label: 'Status',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  <BookingBadge status={dataDetailPayment.data.booking.status} />
                ) : (
                  <Shimmer className='h-6 w-[70px]' />
                ),
            },
          ]}
        />

        <DetailCardTexts
          data={[
            {
              label: 'Nama Lapangan',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  dataDetailPayment.data.booking.field.name
                ) : (
                  <Shimmer className='h-5 w-full' />
                ),
            },
            {
              label: 'Tanggal Pemesanan',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  format(parseISO(dataDetailPayment.data.booking.orderDate), 'd MMMM yyyy', { locale: id })
                ) : (
                  <Shimmer className='h-5 w-full' />
                ),
            },
            {
              label: 'Waktu',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  timeSlotsString(dataDetailPayment.data.booking.timeSlots)
                ) : (
                  <Shimmer className='h-5 w-full' />
                ),
            },
            {
              label: 'Total Harga',
              value:
                isSuccessDetailPayment && dataDetailPayment ? (
                  formatToRupiah(dataDetailPayment.data.booking.price)
                ) : (
                  <Shimmer className='h-5 w-full' />
                ),
            },
          ]}
        />
      </DetailCard>

      <DetailCard title='Info User'>
        {dataDetailPayment && dataDetailPayment.data.user !== null ? (
          <>
            <DetailCardTexts
              data={[
                {
                  label: 'Tipe User',
                  value: dataDetailPayment ? 'User terdaftar' : <Shimmer className='h-5 w-full' />,
                },
                {
                  label: 'Nama lengkap',
                  value: dataDetailPayment ? dataDetailPayment.data.user.fullName : <Shimmer className='h-5 w-full' />,
                },
                {
                  label: 'Email',
                  value: dataDetailPayment ? dataDetailPayment.data.user.email : <Shimmer className='h-5 w-full' />,
                },
                {
                  label: 'No. Telpon',
                  value: dataDetailPayment ? (
                    dataDetailPayment.data.user.telephoneNumber
                  ) : (
                    <Shimmer className='h-5 w-full' />
                  ),
                },
              ]}
            />
          </>
        ) : (
          <DetailCardTexts
            data={[
              {
                label: 'Tipe User',
                value: dataDetailPayment ? 'User tamu' : <Shimmer className='h-5 w-full' />,
              },
            ]}
          />
        )}
      </DetailCard>
    </CMSLayout>
  )
}
