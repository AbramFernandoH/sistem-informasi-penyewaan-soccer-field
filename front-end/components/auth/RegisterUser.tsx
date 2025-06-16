'use client'
import ball from '@/public/pexels-rethaferguson-3621104.jpg'
import NextImg from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { allowOnlyNumbers } from '@/utils/helper'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BaseResponse, User } from '@/utils/type'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline'

type RegisterResponse = BaseResponse<User>

type RegisterRequest = {
  fullName: string
  email: string
  telephoneNumber: string
  password: string
  confirmPassword: string
}

export default function RegisterUser() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isHidePassword, setIsHidePassword] = useState(true)
  const [isHidePasswordConfirmation, setIsHidePasswordConfirmation] = useState(true)

  const {
    handleSubmit,
    register,
    getValues,
    setError,
    formState: { errors },
  } = useForm<RegisterRequest>({
    defaultValues: {
      fullName: '',
      email: '',
      telephoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { isPending, isSuccess, mutate } = useMutation<RegisterResponse, BaseResponse, RegisterRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`${ENV.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Register failed')
      }

      return json
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['pwa-auth'] })

      toast.success('Daftar akun berhasil')

      router.push('/login')
    },
    onError: (err) => {
      if (err.message === 'Email and phone number already exists') {
        toast.error('Email dan No. Handphone sudah terdaftar')

        setError('email', { message: 'Email sudah terdaftar' })
        setError('telephoneNumber', { message: 'No. Handphone sudah terdaftar' })
      } else if (err.message === 'Email already exists') {
        toast.error('Email sudah terdaftar')

        setError('email', { message: 'Email sudah terdaftar' })
      } else if (err.message === 'Phone number already exists') {
        toast.error('No. Handphone sudah terdaftar')

        setError('telephoneNumber', { message: 'No. Handphone sudah terdaftar' })
      }
    },
  })

  const onSubmit = (data: RegisterRequest) => {
    const telephoneNumber = data.telephoneNumber.replace(/^628/, '08')

    mutate({
      ...data,
      telephoneNumber,
    })
  }

  return (
    <>
      <div className='flex min-h-screen flex-1'>
        <div className='flex w-full lg:w-1/2 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
          <div className='mx-auto w-full max-w-sm lg:w-96'>
            <div>
              <NextImg
                src='/goedang-futsal-icon.png'
                alt='goedang-futsal-icon'
                draggable={false}
                width={50}
                height={50}
              />

              <h2 className='mt-8 text-2xl/9 font-bold tracking-tight text-gray-900'>Registrasi akun</h2>
            </div>

            <div className='mt-10'>
              <div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='space-y-6'
                >
                  <div>
                    <label
                      htmlFor='fullname'
                      className='block text-sm/6 font-medium text-gray-900'
                    >
                      Nama Lengkap
                    </label>

                    <div className='mt-2 flex flex-col space-y-1'>
                      <input
                        id='fullname'
                        type='text'
                        placeholder='Ketikan nama lengkap anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                        {...register('fullName', {
                          required: {
                            value: true,
                            message: 'Nama lengkap wajib diisi!',
                          },
                        })}
                      />

                      {errors && errors.fullName && errors.fullName.message && (
                        <p className='text-sm text-red-500'>{errors.fullName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm/6 font-medium text-gray-900'
                    >
                      Email
                    </label>

                    <div className='mt-2 flex flex-col space-y-1'>
                      <input
                        id='email'
                        type='text'
                        placeholder='Ketikan email anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                        {...register('email', {
                          required: {
                            value: true,
                            message: 'Email wajib diisi!',
                          },
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email tidak valid!',
                          },
                        })}
                      />

                      {errors && errors.email && errors.email.message && (
                        <p className='text-sm text-red-500'>{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='no-telp'
                      className='block text-sm/6 font-medium text-gray-900'
                    >
                      No. Handphone
                    </label>

                    <div className='mt-2 flex flex-col space-y-1'>
                      <input
                        id='no-telp'
                        type='text'
                        placeholder='Ketikan nomor telepon anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                        onKeyDown={allowOnlyNumbers}
                        {...register('telephoneNumber', {
                          required: {
                            value: true,
                            message: 'No. Handphone wajib diisi!',
                          },
                          minLength: {
                            message: 'No. Handphone minimal 8 digit!',
                            value: 8,
                          },
                          maxLength: {
                            message: 'No. Handphone maksimal 14 digit!',
                            value: 14,
                          },
                          pattern: {
                            value: /^(628|08)\d*$/,
                            message: 'No. Handphone harus di awali angka 628 atau 08',
                          },
                        })}
                      />

                      {errors && errors.telephoneNumber && errors.telephoneNumber.message && (
                        <p className='text-sm text-red-500'>{errors.telephoneNumber.message}</p>
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

                      <button
                        type='button'
                        onClick={() => {
                          setIsHidePassword(!isHidePassword)
                        }}
                      >
                        {isHidePassword ? <EyeSlashIcon className='size-6' /> : <EyeIcon className='size-6' />}
                      </button>
                    </div>

                    <div className='mt-2 flex flex-col space-y-1'>
                      <input
                        id='password'
                        type={isHidePassword ? 'password' : 'text'}
                        placeholder='Ketikan password anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                        {...register('password', {
                          required: {
                            value: true,
                            message: 'Password wajib diisi!',
                          },
                          minLength: {
                            message: 'Password minimal 8 karakter!',
                            value: 8,
                          },
                        })}
                      />

                      {errors && errors.password && errors.password.message && (
                        <p className='text-sm text-red-500'>{errors.password.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-between'>
                      <label
                        htmlFor='confirm-password'
                        className='block text-sm/6 font-medium text-gray-900'
                      >
                        Konfirmasi Password
                      </label>

                      <button
                        type='button'
                        onClick={() => {
                          setIsHidePasswordConfirmation(!isHidePasswordConfirmation)
                        }}
                      >
                        {isHidePasswordConfirmation ? (
                          <EyeSlashIcon className='size-6' />
                        ) : (
                          <EyeIcon className='size-6' />
                        )}
                      </button>
                    </div>

                    <div className='mt-2 flex flex-col space-y-1'>
                      <input
                        id='confirm-password'
                        type={isHidePasswordConfirmation ? 'password' : 'text'}
                        placeholder='Ketikan ulang password anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                        {...register('confirmPassword', {
                          required: {
                            value: true,
                            message: 'Konfirmasi password wajib diisi!',
                          },
                          validate: {
                            sameWithPassword: (value) =>
                              value === getValues('password') || 'Konfirmasi password harus sama dengan password',
                          },
                        })}
                      />

                      {errors && errors.confirmPassword && errors.confirmPassword.message && (
                        <p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-col space-y-3'>
                    <button
                      type='submit'
                      className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      disabled={isPending || isSuccess}
                    >
                      Submit
                    </button>

                    <span>
                      Sudah punya akun?{' '}
                      <Link
                        href='/login'
                        className='text-indigo-600'
                      >
                        Masuk ke akun
                      </Link>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className='relative hidden w-1/2 lg:block'>
          <NextImg
            src={ball}
            alt='login-image'
            className='absolute inset-0 size-full object-cover'
            draggable='false'
          />
        </div>
      </div>
    </>
  )
}
