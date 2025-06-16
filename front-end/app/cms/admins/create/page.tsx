'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import { useMutation } from '@tanstack/react-query'
import { CreateAdminResponse, CreateAdminRequest } from '@/utils/type'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { fetchWithAuth } from '@/utils/helper'
import { useRouter } from 'next/navigation'

export default function CreateAdmin() {
  const router = useRouter()

  const {
    handleSubmit,
    control,
    register,
    getValues,
    formState: { errors },
  } = useForm<CreateAdminRequest>({
    defaultValues: {
      username: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { isPending, isSuccess, mutate } = useMutation<CreateAdminResponse, unknown, CreateAdminRequest>({
    mutationFn: async (data) => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/admins/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Create admin failed')
      }

      return json
    },
    onSuccess: () => {
      toast.success('Admin user berhasil ditambahkan')

      router.push('/cms/admins')
    },
    onError: () => {
      toast.error('Gagal menambahkan admin user')
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Admin', path: '/cms/admins', current: false },
    { name: 'Tambah Admin', path: '/cms/admins/create', current: true },
  ]

  const onSubmit = (data: CreateAdminRequest) => {
    mutate(data)
  }

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Tambah Admin'
        backUrl='/cms/admins'
      />

      <form
        className='flex flex-col items-center space-y-6 mt-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <FormInput
            control={control}
            id='username'
            name='username'
            type='text'
            label='Username'
            placeholder='Ketikan username anda'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'Username wajib diisi!',
              },
              minLength: {
                message: 'Username minimal 4 karakter!',
                value: 4,
              },
            }}
            errors={errors}
            wrapperClassName='w-full'
          />

          <FormInput
            control={control}
            id='fullName'
            name='fullName'
            type='text'
            label='Nama Lengkap'
            placeholder='Ketikan nama lengkap anda'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'Nama lengkap wajib diisi!',
              },
            }}
            errors={errors}
            wrapperClassName='w-full'
          />
        </div>

        <div className='flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <FormInput
            control={control}
            id='password'
            name='password'
            type='password'
            label='Password'
            placeholder='Ketikan password anda'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'Password wajib diisi!',
              },
              minLength: {
                message: 'Password minimal 8 karakter!',
                value: 8,
              },
            }}
            errors={errors}
            wrapperClassName='w-full'
          />

          <FormInput
            control={control}
            id='confirm-password'
            name='confirmPassword'
            type='password'
            label='Konfirmasi Password'
            placeholder='Ketik ulang password anda'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'Konfirmasi password wajib diisi!',
              },
              validate: {
                sameWithPassword: (value) =>
                  value === getValues('password') || 'Konfirmasi password harus sama dengan password',
              },
            }}
            errors={errors}
            wrapperClassName='w-full'
          />
        </div>

        <button
          type='submit'
          className='flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
          disabled={isPending || isSuccess}
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
