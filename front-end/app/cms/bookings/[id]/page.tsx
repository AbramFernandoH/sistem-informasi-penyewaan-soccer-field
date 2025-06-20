'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'
import Header from '@/components/cms/Header'
import DetailCard from '@/components/cms/DetailCard'
import DetailCardTexts from '@/components/cms/DetailCardTexts'
import DetailCardTable from '@/components/cms/DetailCardTable'
import ConfirmationModal from '@/components/ConfirmationModal'
import { ReactNode, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DetailBookingResponse, ListPaymentResponse } from '@/utils/type'
import { fetchWithAuth, formatToRupiah, hasTimeSlotEnded, timeSlotsString } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import { useParams } from 'next/navigation'
import Shimmer from '@/components/Shimmer'
import BookingBadge from '@/components/BookingBadge'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import PaymentBadge from '@/components/PaymentBadge'
import toast from 'react-hot-toast'

export default function DetailPayment() {
  const params = useParams()
  const queryClient = useQueryClient()

  const [openCreateSecondPaymentModal, setOpenCreateSecondPaymentModal] = useState(false)
  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])
  const { data: dataDetailBooking, isSuccess: isSuccessDetailBooking } = useQuery<
    unknown,
    unknown,
    DetailBookingResponse
  >({
    queryKey: ['booking', params.id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/bookings/${params.id}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get detail booking')
      }

      return res.json()
    },
  })

  const { data: dataListPayment, isSuccess: isSuccessListPayment } = useQuery<unknown, unknown, ListPaymentResponse>({
    queryKey: ['payment', params.id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/payments?bookingId=${params.id}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list payment')
      }

      return res.json()
    },
  })

  const {
    isPending: isPendingCreateSecondPayment,
    isSuccess: isSuccessCreateSecondPayment,
    mutate: mutateCreateSecondPayment,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth(
        'cms',
        `${ENV.API_URL}/bookings/${params.id}/add-registered-second-transaction`,
        {
          method: 'POST',
        }
      )

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Create second transaction failed')
      }

      return json
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['payment'] })
      await queryClient.invalidateQueries({ queryKey: ['booking'] })

      setOpenCreateSecondPaymentModal(false)

      toast.success('Membuat transaksi kedua berhasil')
    },
    onError: () => {
      toast.error('Gagal membuat transaksi kedua')
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Booking', path: '/cms/bookings', current: false },
    { name: 'Detail Booking', path: '/', current: true },
  ]

  const tableHeaders = ['Order Id', 'Tanggal & Waktu', 'Jumlah', 'User', 'Status', 'Action']

  const handleCloseCreateSecondPaymentModal = () => {
    setOpenCreateSecondPaymentModal(false)
  }

  const handleClickCreateSecondPayment = () => {
    mutateCreateSecondPayment()
  }

  const handleClickOpenConfirmationModal = () => {
    setOpenCreateSecondPaymentModal(true)
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
    <>
      <CMSLayout pages={breadcrumbsPages}>
        <Header
          title='Detail Booking'
          backUrl='/cms/bookings'
        />

        <div></div>

        <DetailCard title='Info Booking'>
          <DetailCardTexts
            data={[
              {
                label: 'Nama Penyewa',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    dataDetailBooking.data.name
                  ) : (
                    <Shimmer className='h-5 w-full' />
                  ),
              },
              {
                label: 'Email',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    dataDetailBooking.data.email
                  ) : (
                    <Shimmer className='h-5 w-full' />
                  ),
              },
              {
                label: 'No. Telepon',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    dataDetailBooking.data.telephoneNumber
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

          <DetailCardTexts
            data={[
              {
                label: 'Nama Lapangan',
                value:
                  isSuccessDetailBooking && dataDetailBooking ? (
                    dataDetailBooking.data.field.name
                  ) : (
                    <Shimmer className='h-5 w-full' />
                  ),
              },
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
            ]}
          />
        </DetailCard>

        <DetailCard title='Pembayaran'>
          <DetailCardTable
            headers={tableHeaders}
            data={tableData}
          />

          <div className='flex items-center justify-end space-x-4 border-t border-solid border-gray-300 pt-6'>
            {dataDetailBooking &&
              dataDetailBooking.data.status === 'half_paid' &&
              dataDetailBooking.data.payments.length === 1 && (
                <button
                  type='button'
                  className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  onClick={handleClickOpenConfirmationModal}
                >
                  Buat Pembayaran Kedua
                </button>
              )}

            {dataDetailBooking &&
              ['half_paid', 'fully_paid'].includes(dataDetailBooking.data.status) &&
              hasTimeSlotEnded(dataDetailBooking.data.orderDate, dataDetailBooking.data.timeSlots) &&
              dataDetailBooking.data.payments.some((payment) => payment.status === 'success') && (
                <Link
                  href={`/cms/bookings/${dataDetailBooking.data._id}/refund`}
                  className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Refund
                </Link>
              )}
          </div>
        </DetailCard>
      </CMSLayout>

      <ConfirmationModal
        isOpen={openCreateSecondPaymentModal}
        text='Apakah anda yakin untuk membuat pembayaran kedua pada booking ini?'
        closeModal={handleCloseCreateSecondPaymentModal}
        action={handleClickCreateSecondPayment}
        disabled={isPendingCreateSecondPayment || isSuccessCreateSecondPayment}
      />
    </>
  )
}
