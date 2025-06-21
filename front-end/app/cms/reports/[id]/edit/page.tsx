'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import Dropdown, { DropdownOption } from '@/components/cms/Dropdown'
import { useEffect, useState } from 'react'
import {
  Admin,
  CreateEditReportRequest,
  DetailAssetResponse,
  DetailReportResponse,
  UploadAssetRequest,
} from '@/utils/type'
import ImageUploader from '@/components/cms/ImageUploader'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addDotsToNumber, allowOnlyNumbers, cleanNumber, fetchWithAuth } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { adminProfileStore } from '@/stores/adminProfile'

export default function CreateReport() {
  const router = useRouter()
  const params = useParams()

  const adminProfile = adminProfileStore((state) => state.admin)

  const [openReportTypeDropdown, setOpenReportTypeDropdown] = useState(false)
  const [reportTypeOptions, setReportTypeOptions] = useState<DropdownOption[]>([
    {
      xid: 'income',
      value: 'Pemasukan',
      selected: true,
    },
    {
      xid: 'expense',
      value: 'Pengeluaran',
      selected: false,
    },
  ])

  const {
    handleSubmit,
    control,
    register,
    setValue,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateEditReportRequest>({
    defaultValues: {
      name: '',
      type: 'income',
      totalPrice: '',
      attachment: '',
    },
  })
  const attachment = watch('attachment')
  const totalPrice = watch('totalPrice')

  const { data: dataDetailField, isSuccess: isSuccessDetailField } = useQuery<unknown, unknown, DetailReportResponse>({
    queryKey: ['report'],
    enabled: (params.id ?? '').length > 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/reports/${params.id}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get detail report')
      }

      return res.json()
    },
  })

  const {
    isPending: isPendingCreateReport,
    isSuccess: isSuccessCreateReport,
    mutate: mutateCreateReport,
  } = useMutation<DetailReportResponse, unknown, CreateEditReportRequest & { createdBy: Admin | null }>({
    mutationFn: async (data) => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/reports/${params.id}/edit`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Edit report failed')
      }

      return json
    },
    onSuccess: () => {
      toast.success('Laporan berhasil diubah')

      router.push('/cms/reports')
    },
    onError: () => {
      toast.error('Gagal mengubah laporan')
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
    { name: 'List Laporan', path: '/cms/reports', current: false },
    { name: 'Ubah Laporan', path: '/', current: true },
  ]

  const handleChangeSelectedField = (newSelectedOption: DropdownOption) => {
    const newOptions = reportTypeOptions.map((option) => ({ ...option, selected: false }))
    const selectedIndex = newOptions.findIndex((option) => option.xid === newSelectedOption.xid)

    if (selectedIndex !== -1) {
      newOptions.splice(selectedIndex, 1, { ...newSelectedOption, selected: true })

      setReportTypeOptions(newOptions)

      setValue('type', newSelectedOption.xid as 'income' | 'expense')
    }

    setOpenReportTypeDropdown(false)
  }

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
      totalPrice: cleanNumber(data.totalPrice) as unknown as string,
      createdBy: adminProfile,
    })
  }

  useEffect(() => {
    if (isSuccessDetailField && dataDetailField && dataDetailField.data) {
      const { name, attachment, type, booking } = dataDetailField.data

      if (booking !== null) {
        router.push('/cms/reports')
      }

      reset({
        name,
        attachment,
        type,
        totalPrice: addDotsToNumber(dataDetailField.data.totalPrice),
      })

      setReportTypeOptions((options) => {
        const newValue = options.map((opt) => ({ ...opt, selected: false }))

        const findSelectedTypeIndex = newValue.findIndex((val) => val.xid === type)

        if (findSelectedTypeIndex !== -1) {
          newValue.splice(findSelectedTypeIndex, 1, { ...newValue[findSelectedTypeIndex], selected: true })
        } else {
          newValue.splice(0, 1, { ...newValue[0], selected: true })
        }

        return newValue
      })
    }
  }, [isSuccessDetailField, dataDetailField])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Ubah Laporan'
        backUrl='/cms/reports'
      />

      <form
        className='flex flex-col items-center space-y-6 mt-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex space-x-4 w-full'>
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
        </div>

        <div className='flex flex-col space-y-2 w-full'>
          <FormLabel
            label='Tipe Laporan'
            name='report-type'
          />

          <Dropdown
            isOpen={openReportTypeDropdown}
            setIsOpen={setOpenReportTypeDropdown}
            options={reportTypeOptions}
            handleClickOption={handleChangeSelectedField}
          />
        </div>

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
            fileUrl={attachment}
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
