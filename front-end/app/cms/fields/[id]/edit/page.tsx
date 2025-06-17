'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import { useEffect } from 'react'
import ImageUploader from '@/components/cms/ImageUploader'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CreateEditFieldRequest, DetailAssetResponse, DetailFieldResponse, UploadAssetRequest } from '@/utils/type'
import { addDotsToNumber, cleanNumber, fetchWithAuth } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'

export default function EditField() {
  const params = useParams()
  const router = useRouter()

  const {
    handleSubmit,
    control,
    register,
    reset,
    clearErrors,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CreateEditFieldRequest>({
    defaultValues: {
      name: '',
      pricePerHour: '',
      photo: '',
    },
  })
  const photo = watch('photo')
  const pricePerHour = watch('pricePerHour')

  const { data: dataDetailField, isSuccess: isSuccessDetailField } = useQuery<unknown, unknown, DetailFieldResponse>({
    queryKey: ['field'],
    enabled: (params.id ?? '').length > 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/fields/${params.id}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get detail field')
      }

      return res.json()
    },
  })

  const {
    isPending: isPendingEditField,
    isSuccess: isSuccessEditField,
    mutate: mutateEditField,
  } = useMutation<DetailFieldResponse, unknown, CreateEditFieldRequest>({
    mutationFn: async (data) => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/fields/${params.id}/edit`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Edit field failed')
      }

      return json
    },
    onSuccess: () => {
      toast.success('Lapangan berhasil diubah')

      router.push('/cms/fields')
    },
    onError: () => {
      toast.error('Gagal mengubah lapangan')
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
      toast.success('Foto lapangan berhasil diubah')

      setValue('photo', data.data.imageUrl)
    },
    onError: () => {
      toast.error('Gagal mengubah foto lapangan')
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Lapangan', path: '/cms/fields', current: false },
    { name: 'Edit Lapangan', path: '/', current: true },
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
    mutateEditField({
      ...data,
      pricePerHour: cleanNumber(data.pricePerHour) as unknown as string,
    })
  }

  useEffect(() => {
    if (isSuccessDetailField && dataDetailField && dataDetailField.data) {
      const { name, photo, pricePerHour } = dataDetailField.data

      reset({
        name,
        photo,
        pricePerHour: addDotsToNumber(pricePerHour),
      })
    }
  }, [dataDetailField, isSuccessDetailField, reset])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Edit Lapangan'
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
            label='Nama'
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
            wrapperClassName='w-full'
          />
        </div>

        <div className='flex flex-col space-y-2 w-full'>
          <FormLabel
            label='Foto Lapangan'
            name='photo'
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
            fileUrl={photo}
            errors={errors}
            handleDrop={handleDropImage}
            handleRemove={handleRemoveImage}
            uploading={isPendingUploadFieldPhoto}
          />
        </div>

        <button
          type='submit'
          className='w-fit rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          disabled={isPendingEditField || isSuccessEditField || isPendingUploadFieldPhoto}
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
