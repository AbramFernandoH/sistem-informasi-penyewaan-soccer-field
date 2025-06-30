'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import ImageUploader from '@/components/cms/ImageUploader'
import {
  Admin,
  DetailAssetResponse,
  DetailBookingResponse,
  DetailFieldResponse,
  RefundBookingRequest,
  UploadAssetRequest,
} from '@/utils/type'
import { fetchWithAuth } from '@/utils/helper'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { adminProfileStore } from '@/stores/adminProfile'

export default function RefundBooking() {
  const router = useRouter()
  const params = useParams()

  const adminProfile = adminProfileStore((state) => state.admin)

  const {
    handleSubmit,
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<RefundBookingRequest>({
    defaultValues: {
      refundNote: '',
      refundProof: '',
    },
  })

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

  const {
    isPending: isPendingRefundBooking,
    isSuccess: isSuccessRefundBooking,
    mutate: mutateRefundBooking,
  } = useMutation<DetailFieldResponse, unknown, RefundBookingRequest & { admin: Admin | null }>({
    mutationFn: async (data) => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/bookings/${params.id}/refund`, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Refund booking failed')
      }

      return json
    },
    onSuccess: () => {
      toast.success('Booking berhasil di refund')

      router.push(breadcrumbsPages[1].path)
    },
    onError: () => {
      toast.error('Gagal refund booking')
    },
  })

  const { isPending: isPendingUploadRefundProofPhoto, mutate: mutateUploadRefundProofPhoto } = useMutation<
    DetailAssetResponse,
    unknown,
    UploadAssetRequest
  >({
    mutationFn: async (data) => {
      const formData = new FormData()
      formData.append('image', data.file)

      const response = await fetchWithAuth('cms', `${ENV.API_URL}/assets/upload`, {
        method: 'POST',
        body: formData,
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Upload refund proof photo failed')
      }

      return json
    },
    onSuccess: (data) => {
      toast.success('Foto bukti refund berhasil ditambahkan')

      setValue('refundProof', data.data.imageUrl)
    },
    onError: () => {
      toast.error('Gagal menambahkan foto bukti refund')
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = useMemo(() => {
    if (params.id) {
      return [
        { name: 'List Booking', path: '/cms/bookings', current: false },
        { name: 'Detail Booking', path: `/cms/bookings/${params.id}`, current: false },
        { name: 'Refund Booking', path: `/cms/bookings/${params.id}/refund`, current: true },
      ]
    }

    return [
      { name: 'List Booking', path: '/cms/bookings', current: false },
      { name: 'Detail Booking', path: '/cms/bookings/', current: false },
      { name: 'Refund Booking', path: '/cms/bookings//refund', current: true },
    ]
  }, [params.id])

  const handleDropImage = async (droppedFile: File) => {
    mutateUploadRefundProofPhoto({
      contentType: droppedFile.type,
      file: droppedFile,
    })

    clearErrors('refundProof')
  }

  const handleRemoveImage = () => {
    setValue('refundProof', '')
  }

  const onSubmit = (data: RefundBookingRequest) => {
    mutateRefundBooking({
      ...data,
      admin: adminProfile,
    })
  }

  useEffect(() => {
    if (
      isSuccessDetailBooking &&
      dataDetailBooking &&
      !['half_paid', 'fully_paid'].includes(dataDetailBooking.data.status)
    ) {
      router.push(breadcrumbsPages[1].path)
    }
  }, [isSuccessDetailBooking, dataDetailBooking, router, breadcrumbsPages])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Refund Booking'
        backUrl={breadcrumbsPages[1].path}
      />

      <form
        className='flex flex-col items-center space-y-6 mt-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput
          control={control}
          id='refundNote'
          name='refundNote'
          type='text'
          label='Catatan'
          placeholder='Ketikan catatan/alasan refund booking'
          register={register}
          rules={{
            required: {
              value: true,
              message: 'Catatan/alasan refund booking wajib diisi',
            },
          }}
          errors={errors}
          wrapperClassName='w-full'
        />

        <div className='flex flex-col space-y-2 w-full'>
          <FormLabel
            label='Bukti Transfer'
            name='refundProof'
          />

          <ImageUploader
            control={control}
            name='refundProof'
            label='Foto Bukti Transfer Refund'
            placeholder='Klik untuk mengupload atau drag foto ke inputan ini'
            rules={{
              required: {
                value: true,
                message: 'Foto bukti transfer refund wajib diisi!',
              },
            }}
            errors={errors}
            handleDrop={handleDropImage}
            handleRemove={handleRemoveImage}
            uploading={isPendingUploadRefundProofPhoto}
          />
        </div>

        <button
          type='submit'
          className='flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
          disabled={isPendingRefundBooking || isSuccessRefundBooking || isPendingUploadRefundProofPhoto}
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
