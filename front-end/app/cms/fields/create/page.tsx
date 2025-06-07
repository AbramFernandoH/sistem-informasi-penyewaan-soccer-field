'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import { useEffect, useState } from 'react'
import ImageUploader from '@/components/cms/ImageUploader'

type CreateFieldRequest = {
  name: string
  price: string
  picture: string
}

export default function CreateField() {
  const [isLoading, _setIsLoading] = useState(false)

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    watch,
  } = useForm<CreateFieldRequest>({
    defaultValues: {
      name: '',
      price: '',
      picture: '',
    },
  })
  const pic = watch('picture')

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Lapangan', path: '/cms/fields', current: false },
    { name: 'Tambah Lapangan', path: '/cms/fields/create', current: true },
  ]

  const onSubmit = (data: CreateFieldRequest) => {
    // TODO: hit upload field endpoint first, then hit create field endpoint
    console.log(data)
  }

  useEffect(() => {
    console.log(pic)
  }, [pic])

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
        <div className='flex items-center space-x-4 w-full'>
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
                message: 'nama lapangan wajib diisi',
              },
            }}
            errors={errors}
            wrapperClassName='w-full'
          />

          <FormInput
            control={control}
            id='price'
            name='price'
            type='text'
            label='Harga per jam'
            placeholder='Ketikan harga lapangan per jam'
            register={register}
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
            name='picture'
          />

          <ImageUploader
            control={control}
            name='picture'
            label='Foto Lapangan'
            placeholder='Klik untuk mengupload atau drag foto ke inputan ini'
            rules={{
              required: true,
            }}
            errors={errors}
            handleDrop={async (droppedFile: File) => {
              console.log(droppedFile)
            }}
            handleRemove={() => {}}
            uploading={isLoading}
          />
        </div>

        <button
          type='submit'
          className='w-fit rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
