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
import { useState } from 'react'

export default function DetailPayment() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false)

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Booking', path: '/cms/bookings', current: false },
    { name: 'Detail Booking', path: '/', current: true },
  ]

  const tableHeaders = ['Order Id', 'Tanggal & Waktu', 'Jumlah', 'User', 'Status', 'Action']

  const tableData = [
    [
      'order-1',
      '18 Juni 2025 17:00',
      'Rp 1.000.000',
      '-',
      <div
        key={1}
        className='bg-red-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit'
      >
        Failure
      </div>,
      <Link
        key={1}
        href={`/cms/payments/payment-1`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'order-2',
      '18 Juni 2025 17:00',
      'Rp 300.000',
      'Fernando',
      <div
        key={2}
        className='bg-orange-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit'
      >
        Pending
      </div>,
      <Link
        key={2}
        href={`/cms/payments/payment-2`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
    [
      'order-3',
      '18 Juni 2025 17:00',
      'Rp 5.000.000',
      'Abram',
      <div
        key={3}
        className='bg-green-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit'
      >
        Success
      </div>,
      <Link
        key={3}
        href={`/cms/payments/payment-3`}
        className='w-fit flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <EyeIcon className='size-3' />

        <span>Detail</span>
      </Link>,
    ],
  ]

  const handleCloseModal = () => {
    setIsOpenConfirmationModal(false)
  }

  const handleClickCreateSecondPayment = () => {
    // TODO: implement api create second payment
    setIsOpenConfirmationModal(false)
  }

  const handleClickOpenConfirmationModal = () => {
    setIsOpenConfirmationModal(true)
  }

  return (
    <>
      <CMSLayout pages={breadcrumbsPages}>
        <Header
          title='Detail Booking'
          backUrl='/cms/bookings'
        />

        <DetailCard title='Info Booking'>
          <DetailCardTexts
            data={[
              {
                label: 'Nama Penyewa',
                value: 'Abram Fernando',
              },
              {
                label: 'Email',
                value: 'abram@gmail.comasjkdhasjkldhajksldhlasdhjkasdasdasdasdasdaso',
              },
              {
                label: 'No. Telepon',
                value: '089617715065',
              },
              {
                label: 'Status',
                value: (
                  <div
                    key={`status-1`}
                    className={`bg-green-500 text-white text-xs px-2 py-1 box-border rounded-lg w-fit`}
                  >
                    Lunas
                  </div>
                ),
              },
            ]}
          />

          <DetailCardTexts
            data={[
              {
                label: 'Nama Lapangan',
                value: 'Lapangan 2',
              },
              {
                label: 'Tanggal Pemesanan',
                value: '31 Desember 2025',
              },
              {
                label: 'Waktu',
                value: '07:00 - 09:00',
              },
              {
                label: 'Total Harga',
                value: 'Rp 300.000',
              },
            ]}
          />
        </DetailCard>

        <DetailCard title='Pembayaran'>
          <DetailCardTable
            headers={tableHeaders}
            data={tableData}
          />

          <div className='flex justify-end border-t border-solid border-gray-300 pt-6'>
            <button
              type='button'
              className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={handleClickOpenConfirmationModal}
            >
              Buat Pembayaran Kedua
            </button>
          </div>
        </DetailCard>
      </CMSLayout>

      <ConfirmationModal
        isOpen={isOpenConfirmationModal}
        text='Apakah anda yakin untuk membuat pembayaran kedua pada booking ini?'
        closeModal={handleCloseModal}
        action={handleClickCreateSecondPayment}
      />
    </>
  )
}
