'use client'
import ball from '@/public/pexels-rethaferguson-3621104.jpg'
import NextImg from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BaseResponse, User } from '@/utils/type'
import { COOKIES, ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { fetchWithAuth, setCookie } from '@/utils/helper'
import { useRouter } from 'next/navigation'
import { userProfileStore } from '@/stores/userProfile'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { cartStore } from '@/stores/cart'

type LoginResponse = BaseResponse<{
  accessToken: string
  refreshToken: string
  user: User
}>

type LoginRequest = {
  email: string
  password: string
}

export default function LoginUser() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [isHidePassword, setIsHidePassword] = useState(true)

  const setUserProfile = userProfileStore((state) => state.setUserProfile)
  const { setCartItems } = cartStore((state) => state)

  const { isPending, isSuccess, mutate } = useMutation<LoginResponse, BaseResponse, LoginRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`${ENV.API_URL}/auth/login`, {
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
      await queryClient.invalidateQueries({ queryKey: ['pwa-auth'] })

      toast.success('Login berhasil')

      // Set tokens
      setCookie(COOKIES.USER_ACCESS_TOKEN, accessToken, 1)
      setCookie(COOKIES.USER_REFRESH_TOKEN, refreshToken, 7)

      setUserProfile(user)

      try {
        const res = await fetchWithAuth('pwa', `${ENV.API_URL}/carts`)

        const cartRes = await res.json()

        setCartItems(cartRes.data.items)
      } catch {
        toast.error('Gagal memuat keranjang')
      }

      router.push('/')
    },
    onError: (err) => {
      if (err.message.includes('Invalid credentials')) {
        toast.error('Email dan/atau password salah')
      }
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginRequest) => {
    mutate(data)
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

              <h2 className='mt-8 text-2xl/9 font-bold tracking-tight text-gray-900'>Masuk ke akun</h2>
            </div>

            <div className='mt-10'>
              <div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='space-y-6'
                >
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
                        type='email'
                        placeholder='Ketikan email anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                        {...register('email', {
                          required: {
                            value: true,
                            message: 'Email wajib diisi!',
                          },
                        })}
                      />

                      {errors && errors.email && errors.email.message && (
                        <p className='text-sm text-red-500'>{errors.email.message}</p>
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
                        })}
                      />

                      {errors && errors.password && errors.password.message && (
                        <p className='text-sm text-red-500'>{errors.password.message}</p>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-col space-y-3'>
                    <button
                      type='submit'
                      className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-200 disabled:hover:cursor-not-allowed'
                      disabled={isPending || isSuccess}
                    >
                      Masuk
                    </button>

                    <span>
                      Belum punya akun?{' '}
                      <Link
                        href='/register'
                        className='text-indigo-600'
                      >
                        Registrasi akun
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
