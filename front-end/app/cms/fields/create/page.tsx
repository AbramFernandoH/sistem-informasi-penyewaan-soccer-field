'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import ImageUploader from '@/components/cms/ImageUploader'
import { CreateEditFieldRequest, DetailAssetResponse, DetailFieldResponse, UploadAssetRequest } from '@/utils/type'
import { addDotsToNumber, allowOnlyNumbers, cleanNumber, fetchWithAuth } from '@/utils/helper'
import { useMutation } from '@tanstack/react-query'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function CreateField() {
  const router = useRouter()

  const {
    handleSubmit,
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm<CreateEditFieldRequest>({
    defaultValues: {
      name: '',
      pricePerHour: '',
      photo: '',
    },
  })
  const pricePerHour = watch('pricePerHour')

  const {
    isPending: isPendingCreateField,
    isSuccess: isSuccessCreateField,
    mutate: mutateCreateField,
  } = useMutation<DetailFieldResponse, unknown, CreateEditFieldRequest>({
    mutationFn: async (data) => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/fields/add`, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Create field failed')
      }

      return json
    },
    onSuccess: () => {
      toast.success('Lapangan berhasil ditambahkan')

      router.push('/cms/fields')
    },
    onError: () => {
      toast.error('Gagal menambahkan lapangan')
    },
  })

  const { isPending: isPendingUploadFieldPhoto, mutate: mutateUploadFieldPhoto } = useMutation<
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
        throw new Error(json.message || 'Upload field photo failed')
      }

      return json
    },
    onSuccess: (data) => {
      toast.success('Foto lapangan berhasil ditambahkan')

      setValue('photo', data.data.imageUrl)
    },
    onError: () => {
      toast.error('Gagal menambahkan foto lapangan')
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Lapangan', path: '/cms/fields', current: false },
    { name: 'Tambah Lapangan', path: '/cms/fields/create', current: true },
  ]

  const handleDropImage = async (droppedFile: File) => {
    mutateUploadFieldPhoto({
      contentType: droppedFile.type,
      file: droppedFile,
    })

    clearErrors('photo')
  }

  const handleRemoveImage = () => {
    setValue('photo', '')
  }

  const onSubmit = (data: CreateEditFieldRequest) => {
    mutateCreateField({
      ...data,
      pricePerHour: cleanNumber(data.pricePerHour) as unknown as string,
    })
  }

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Tambah Lapangan'
        backUrl='/cms/fields'
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
            label='Nama Lapangan'
            placeholder='Ketikan nama lapangan'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'Nama lapangan wajib diisi',
              },
            }}
            errors={errors}
            wrapperClassName='w-full'
          />

          <FormInput
            control={control}
            id='price'
            name='pricePerHour'
            type='text'
            label='Harga per jam'
            placeholder='Ketikan harga lapangan per jam'
            register={register}
            value={
              cleanNumber(String(pricePerHour)) === 0 || pricePerHour === undefined
                ? ''
                : addDotsToNumber(pricePerHour ?? 0)
            }
            rules={{
              required: {
                value: true,
                message: 'Harga lapangan wajib diisi',
              },
            }}
            errors={errors}
            onKeyDown={allowOnlyNumbers}
            wrapperClassName='w-full'
          />
        </div>

        <div className='flex flex-col space-y-2 w-full'>
          <FormLabel
            label='Foto Lapangan'
            name='picture'
          />

          <ImageUploader
            control={control}
            name='photo'
            label='Foto Lapangan'
            placeholder='Klik untuk mengupload atau drag foto ke inputan ini'
            rules={{
              required: {
                value: true,
                message: 'Foto lapangan wajib diisi!',
              },
            }}
            errors={errors}
            handleDrop={handleDropImage}
            handleRemove={handleRemoveImage}
            uploading={isPendingUploadFieldPhoto}
          />
        </div>

        <button
          type='submit'
          className='flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
          disabled={isPendingCreateField || isSuccessCreateField || isPendingUploadFieldPhoto}
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
