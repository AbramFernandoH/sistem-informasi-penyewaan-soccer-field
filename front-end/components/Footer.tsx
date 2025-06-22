import React from 'react'
import NextImg from 'next/image'
import Link from 'next/link'
import { userProfileStore } from '@/stores/userProfile'

export default function Footer() {
  const user = userProfileStore((state) => state.user)

  const links = [
    {
      url: '/',
      name: 'Beranda',
    },
    {
      url: '/about',
      name: 'Tentang Kami',
    },
    {
      url: '/fields',
      name: 'Lapangan Kami',
    },
  ]

  const loggedLinks = [
    {
      url: '/carts',
      name: 'Keranjang',
    },
  ]

  return (
    <footer className='shadow-sm bg-gray-900'>
      <div className='w-full max-w-screen-xl mx-auto p-4 md:py-8'>
        <div className='flex flex-col lg:flex-row items-center justify-between'>
          <Link
            href='/'
            className='flex items-center mb-4 lg:mb-0 space-x-3 rtl:space-x-reverse'
          >
            <NextImg
              src='/goedang-futsal-icon.png'
              alt='goedang-futsal-icon'
              width={50}
              height={50}
            />

            <span className='self-center text-2xl font-semibold whitespace-nowrap text-white'>Goedang Futsal</span>
          </Link>

          <ul className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-0 text-sm font-medium text-gray-400'>
            {(user === null ? links : [...links, ...loggedLinks]).map((link) => (
              <li key={link.url}>
                <Link
                  href={link.url}
                  className='hover:underline me-4 md:me-6'
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <hr className='my-6 border-gray-200 mx-auto dark:border-gray-700 lg:my-8' />

        <span className='block text-sm text-gray-500 text-center dark:text-gray-400'>
          © {new Date().getFullYear()}{' '}
          <Link
            href='/'
            className='hover:underline'
          >
            Goedang Futsal™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}
