'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'

type CreateAdminRequest = {
  userName: string
  fullName: string
  password: string
  confirmPassword: string
}

export default function CreateAdmin() {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<CreateAdminRequest>({
    defaultValues: {
      userName: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Admin', path: '/cms/admins', current: false },
    { name: 'Create Admin', path: '/cms/admins/create', current: true },
  ]

  const onSubmit = (data: CreateAdminRequest) => {
    console.log(data)
  }

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Create Admin'
        backUrl='/cms/admins'
      />

      <form
        className='flex flex-col items-center space-y-6 mt-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex items-center space-x-2 w-full'>
          <FormInput
            control={control}
            id='userName'
            name='userName'
            type='text'
            label='Username'
            placeholder='Ketikan username anda'
            register={register}
            rules={{
              required: true,
            }}
            errors={errors}
            wrapperClassName='w-full'
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
              required: true,
            }}
            errors={errors}
            wrapperClassName='w-full'
          />
        </div>

        <div className='flex items-center space-x-2 w-full'>
          <FormInput
            control={control}
            id='password'
            name='password'
            type='password'
            label='Password'
            placeholder='Ketikan kata sandi anda'
            register={register}
            rules={{
              required: true,
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
              required: true,
            }}
            errors={errors}
            wrapperClassName='w-full'
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
