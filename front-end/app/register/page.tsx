import ball from '@/public/pexels-rethaferguson-3621104.jpg'
import NextImg from 'next/image'
import React from 'react'

export default function Register() {
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
                <div className='space-y-6'>
                  <div>
                    <label
                      htmlFor='fullname'
                      className='block text-sm/6 font-medium text-gray-900'
                    >
                      Full Name
                    </label>
                    <div className='mt-2'>
                      <input
                        id='fullname'
                        name='fullname'
                        type='text'
                        required
                        placeholder='Ketikan nama lengkap anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm/6 font-medium text-gray-900'
                    >
                      Email
                    </label>
                    <div className='mt-2'>
                      <input
                        id='email'
                        name='email'
                        type='email'
                        required
                        autoComplete='email'
                        placeholder='Ketikan email anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='no-telp'
                      className='block text-sm/6 font-medium text-gray-900'
                    >
                      No. Telepon
                    </label>
                    <div className='mt-2'>
                      <input
                        id='no-telp'
                        name='no-telp'
                        type='tel'
                        required
                        placeholder='Ketikan nomor telepon anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='password'
                      className='block text-sm/6 font-medium text-gray-900'
                    >
                      Password
                    </label>
                    <div className='mt-2'>
                      <input
                        id='password'
                        name='password'
                        type='password'
                        required
                        autoComplete='current-password'
                        placeholder='Ketikan password anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='confirm-password'
                      className='block text-sm/6 font-medium text-gray-900'
                    >
                      Confirm Password
                    </label>
                    <div className='mt-2'>
                      <input
                        id='confirm-password'
                        name='confirm-password'
                        type='password'
                        required
                        autoComplete='current-password'
                        placeholder='Ketikan ulang password anda'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type='submit'
                      className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    >
                      Submit
                    </button>
                  </div>
                </div>
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
