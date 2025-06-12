'use client'
import NextImg from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Admin, BaseResponse } from '@/utils/type'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ENV, COOKIES } from '@/utils/constants'
import { setCookie } from '@/utils/helper'
import { adminProfileStore } from '@/stores/adminProfile'

type LoginResponse = BaseResponse<{
  accessToken: string
  refreshToken: string
  user: Admin
}>

type LoginRequest = {
  username: string
  password: string
}

const LoginAdmin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const setAdminProfile = adminProfileStore((state) => state.setAdminProfile)

  const { isPending, isSuccess, mutate } = useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`${ENV.API_URL}/auth-admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Login failed')
      }

      return json
    },
    onSuccess: async (data) => {
      const { accessToken, refreshToken, user } = data.data
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['cms-auth'] })

      toast.success('Login berhasil')

      // Set tokens
      setCookie(COOKIES.ADMIN_ACCESS_TOKEN, accessToken, 1)
      setCookie(COOKIES.ADMIN_REFRESH_TOKEN, refreshToken, 7)

      setAdminProfile(user)

      router.push('/cms/dashboard')
    },
    onError: (err) => {
      if (String(err).includes('Invalid credentials')) {
        toast.error('Username dan/atau password salah')
      }
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginRequest) => {
    mutate(data)
  }

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <NextImg
            src='/goedang-futsal-icon.png'
            alt='goedang-futsal-icon'
            width={50}
            height={50}
            className='mx-auto'
          />

          <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>Login to your account</h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div>
              <label
                htmlFor='username'
                className='block text-sm/6 font-medium text-gray-900'
              >
                Username
              </label>

              <div className='mt-2 flex flex-col space-y-1'>
                <input
                  id='username'
                  type='text'
                  autoComplete='off'
                  placeholder='Ketikan username anda'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  {...register('username', {
                    required: {
                      value: true,
                      message: 'Username wajib diisi!',
                    },
                  })}
                />

                {errors && errors.username && errors.username.message && (
                  <p className='text-sm text-red-500'>{errors.username.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm/6 font-medium text-gray-900'
                >
                  Password
                </label>
              </div>

              <div className='mt-2 flex flex-col space-y-1'>
                <input
                  id='password'
                  type='password'
                  placeholder='Ketikan password anda'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'Password wajib diisi!',
                    },
                  })}
                />

                {errors && errors.password && errors.password.message && (
                  <p className='text-sm text-red-500'>{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:text-white disabled:bg-primary'
                disabled={isPending || isSuccess}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginAdmin
