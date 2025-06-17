'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DetailAdminResponse, EditAdminRequest } from '@/utils/type'
import { fetchWithAuth } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function EditAdmin() {
  const params = useParams()
  const router = useRouter()

  const { data: dataDetailAdmin, isSuccess: isSuccessDetailAdmin } = useQuery<unknown, unknown, DetailAdminResponse>({
    queryKey: ['admin'],
    enabled: (params.id ?? '').length > 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/admins/${params.id}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get detail admin')
      }

      return res.json()
    },
  })

  const {
    isPending: isPendingEditAdmin,
    isSuccess: isSuccessEditAdmin,
    mutate: mutateEditAdmin,
  } = useMutation<DetailAdminResponse, unknown, EditAdminRequest>({
    mutationFn: async (data) => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/admins/${params.id}/edit`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Edit admin failed')
      }

      return json
    },
    onSuccess: () => {
      toast.success('Admin user berhasil diubah')

      router.push('/cms/admins')
    },
    onError: () => {
      toast.error('Gagal mengubah admin user')
    },
  })

  const {
    handleSubmit,
    control,
    register,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm<EditAdminRequest>({
    defaultValues: {
      username: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Admin', path: '/cms/admins', current: false },
    { name: 'Edit Admin', path: '/', current: true },
  ]

  const onSubmit = (data: EditAdminRequest) => {
    const request: EditAdminRequest = {
      username: data.username,
      fullName: data.fullName,
    }

    if (data.password && data.password.length > 0) {
      request.password = data.password
    }

    mutateEditAdmin(request)
  }

  useEffect(() => {
    if (isSuccessDetailAdmin && dataDetailAdmin && dataDetailAdmin.data) {
      reset({
        username: dataDetailAdmin.data.username,
        fullName: dataDetailAdmin.data.fullName,
        password: '',
        confirmPassword: '',
      })
    }
  }, [dataDetailAdmin, isSuccessDetailAdmin, reset])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Edit Admin'
        backUrl='/cms/admins'
      />

      <form
        className='flex flex-col items-center space-y-6 mt-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex space-x-2 w-full'>
          <FormInput
            control={control}
            id='username'
            name='username'
            type='text'
            label='Username'
            placeholder='Ketikan username anda'
            register={register}
            rules={{
              required: true,
            }}
            errors={errors}
            wrapperClassName='w-full'
            disabled
          />

          <FormInput
            control={control}
            id='fullName'
            name='fullName'
            type='text'
            label='Full Name'
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

        <div className='flex space-x-2 w-full'>
          <FormInput
            control={control}
            id='password'
            name='password'
            type='password'
            label='Password'
            placeholder='Ketikan kata sandi anda'
            register={register}
            rules={{
              required: false,
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
            placeholder='Ketik ulang kata sandi anda'
            register={register}
            rules={{
              required: false,
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
          disabled={isPendingEditAdmin || isSuccessEditAdmin || !isDirty}
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
