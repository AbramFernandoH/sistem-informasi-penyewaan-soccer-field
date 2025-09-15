'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import {
  Admin,
  CreateEditReportRequest,
  DetailAssetResponse,
  DetailReportResponse,
  UploadAssetRequest,
} from '@/utils/type'
import ImageUploader from '@/components/cms/ImageUploader'
import { useMutation } from '@tanstack/react-query'
import { addDotsToNumber, allowOnlyNumbers, cleanNumber, fetchWithAuth } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { adminProfileStore } from '@/stores/adminProfile'

export default function CreateReport() {
  const router = useRouter()

  const adminProfile = adminProfileStore((state) => state.admin)

  const {
    handleSubmit,
    control,
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<CreateEditReportRequest>({
    defaultValues: {
      name: '',
      type: 'expense',
      totalPrice: '',
      attachment: '',
    },
  })
  const totalPrice = watch('totalPrice')

  const {
    isPending: isPendingCreateReport,
    isSuccess: isSuccessCreateReport,
    mutate: mutateCreateReport,
  } = useMutation<DetailReportResponse, unknown, CreateEditReportRequest & { createdBy: Admin | null }>({
    mutationFn: async (data) => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/reports/add`, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Create outcome failed')
      }

      return json
    },
    onSuccess: () => {
      toast.success('Pengeluaran berhasil ditambahkan')

      router.push('/cms/outcomes')
    },
    onError: () => {
      toast.error('Gagal menambahkan laporan')
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
        throw new Error(json.message || 'Upload payment proof photo failed')
      }

      return json
    },
    onSuccess: (data) => {
      toast.success('Foto bukti pembayaran berhasil ditambahkan')

      setValue('attachment', data.data.imageUrl)
    },
    onError: () => {
      toast.error('Gagal menambahkan foto bukti pembayaran')
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Pengeluaran', path: '/cms/outcomes', current: false },
    { name: 'Tambah Pengeluaran', path: '/cms/outcomes/create', current: true },
  ]

  const handleDropImage = async (droppedFile: File) => {
    mutateUploadRefundProofPhoto({
      contentType: droppedFile.type,
      file: droppedFile,
    })

    clearErrors('attachment')
  }

  const handleRemoveImage = () => {
    setValue('attachment', '')
  }

  const onSubmit = (data: CreateEditReportRequest) => {
    mutateCreateReport({
      ...data,
      type: 'expense',
      totalPrice: cleanNumber(data.totalPrice) as unknown as string,
      createdBy: adminProfile,
    })
  }

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Tambah Pengeluaran'
        backUrl='/cms/outcomes'
      />

      <form
        className='flex flex-col items-center space-y-6 mt-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput
          control={control}
          id='name'
          name='name'
          type='text'
          label='Nama Laporan'
          placeholder='Ketikan nama laporan. misal Maintenance rumput'
          register={register}
          rules={{
            required: {
              value: true,
              message: 'Nama laporan wajib diisi!',
            },
          }}
          errors={errors}
          wrapperClassName='w-full'
        />

        <FormInput
          control={control}
          id='price'
          name='totalPrice'
          type='text'
          label='Jumlah'
          placeholder='Ketik jumlah pemasukan atau pengeluaran'
          register={register}
          value={
            cleanNumber(String(totalPrice)) === 0 || totalPrice === undefined ? '' : addDotsToNumber(totalPrice ?? 0)
          }
          rules={{
            required: {
              value: true,
              message: 'Jumlah wajib diisi!',
            },
          }}
          errors={errors}
          onKeyDown={allowOnlyNumbers}
          wrapperClassName='w-full'
        />

        <div className='flex flex-col space-y-2 w-full'>
          <FormLabel
            label='Bukti Pembayaran'
            name='attachment'
          />

          <ImageUploader
            control={control}
            name='attachment'
            label='Bukti Pembayaran'
            placeholder='Klik untuk mengupload atau drag foto ke inputan ini'
            errors={errors}
            handleDrop={handleDropImage}
            handleRemove={handleRemoveImage}
            uploading={isPendingUploadRefundProofPhoto}
          />
        </div>

        <button
          type='submit'
          className='flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
          disabled={isPendingCreateReport || isSuccessCreateReport || isPendingUploadRefundProofPhoto}
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
