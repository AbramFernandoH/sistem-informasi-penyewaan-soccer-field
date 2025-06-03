'use client'
import NextImg from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const pathname = usePathname()

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
    // TODO: change it to be profile sibling and add shopping cart icon
    {
      url: '/cart',
      name: 'Keranjang',
    },
  ]

  return (
    <nav className='bg-primary border-gray-200 fixed top-0 left-0 w-full z-50'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <Link
          href='/'
          className='flex items-center space-x-3 rtl:space-x-reverse'
        >
          <NextImg
            src='/goedang-futsal-icon.png'
            alt='goedang-futsal-icon'
            width={50}
            height={50}
          />

          <span className='self-center text-2xl font-semibold whitespace-nowrap'>Goedang Futsal</span>
        </Link>

        <div className='flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse'>
          <button
            type='button'
            className='flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
            id='user-menu-button'
            aria-expanded='false'
            data-dropdown-toggle='user-dropdown'
            data-dropdown-placement='bottom'
          >
            <span className='sr-only'>Open user menu</span>

            <NextImg
              src='/docs/images/people/profile-picture-3.jpg'
              alt='user photo'
              className='rounded-full'
              width={32}
              height={32}
            />
          </button>

          <div
            className='z-50 hidden my-4 text-base list-none divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600'
            id='user-dropdown'
          >
            <div className='px-4 py-3'>
              <span className='block text-sm text-gray-900 dark:text-white'>Bonnie Green</span>
              <span className='block text-sm  text-gray-500 truncate dark:text-gray-400'>name@flowbite.com</span>
            </div>

            <ul
              className='py-2'
              aria-labelledby='user-menu-button'
            >
              <li>
                <a
                  href='#'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
          <button
            data-collapse-toggle='navbar-user'
            type='button'
            className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-user'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 1h15M1 7h15M1 13h15'
              />
            </svg>
          </button>
        </div>
        <div
          className='items-center justify-between hidden w-full md:flex md:w-auto md:order-1'
          id='navbar-user'
        >
          <ul className='flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0'>
            {links.map((data, idx) => (
              <li key={idx}>
                <Link
                  href={data.url}
                  className={`block py-2 px-3 ${data.url === pathname ? 'text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}  md:p-0`}
                >
                  {data.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
