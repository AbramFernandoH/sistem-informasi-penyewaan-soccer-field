'use client'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, UserCircleIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import NextImg from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { userProfileStore } from '@/stores/userProfile'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCookie, fetchWithAuth } from '@/utils/helper'
import { COOKIES, ENV } from '@/utils/constants'
import toast from 'react-hot-toast'

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { user, resetUserProfile } = userProfileStore((state) => state)

  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth('pwa', `${ENV.API_URL}/auth/logout`, {
        method: 'DELETE',
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Logout failed')
      }

      return json
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['pwa-auth'] })

      toast.success('Logout berhasil')

      // delete tokens
      deleteCookie(COOKIES.USER_ACCESS_TOKEN)
      deleteCookie(COOKIES.USER_REFRESH_TOKEN)

      resetUserProfile()

      router.push('/')
    },
    onError: () => {
      toast.error('Gagal logout')
    },
  })

  const handleClickLogout = async () => {
    mutate()
  }

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

  const authLinks = [
    {
      url: '/login',
      name: 'Login',
    },
    {
      url: '/register',
      name: 'Register',
    },
  ]

  return (
    <Disclosure
      as='nav'
      className='bg-white shadow fixed top-0 left-0 w-full z-50'
    >
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
            {/* Mobile menu button */}
            <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
              <span className='absolute -inset-0.5' />

              <span className='sr-only'>Open main menu</span>

              <Bars3Icon
                aria-hidden='true'
                className='block size-6 group-data-[open]:hidden'
              />

              <XMarkIcon
                aria-hidden='true'
                className='hidden size-6 group-data-[open]:block'
              />
            </DisclosureButton>
          </div>

          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <Link
              href='/'
              className='flex items-center space-x-3 rtl:space-x-reverse shrink-0'
            >
              <NextImg
                src='/goedang-futsal-icon.png'
                alt='goedang-futsal-icon'
                width={50}
                height={50}
                draggable={false}
              />

              <span className='hidden lg:block self-center text-2xl font-semibold whitespace-nowrap'>
                Goedang Futsal
              </span>
            </Link>

            <div className='hidden ml-10 md:flex space-x-8'>
              {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
              {links.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className={`inline-flex items-center border-b-2 ${pathname === link.url ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {user !== null ? (
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
              <Menu
                as='div'
                className='relative ml-3'
              >
                <div>
                  <Link
                    href='/cart'
                    className='relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    <ShoppingCartIcon className='size-6 md:size-8' />

                    {/* TODO: change hidden class to flex, when cart api is implemented */}
                    <span className='absolute -top-2.5 -right-2.5 bg-red-600 text-white p-2 rounded-full h-6 w-6 hidden justify-center items-center'>
                      9+
                    </span>
                  </Link>
                </div>
              </Menu>

              {/* Profile dropdown */}
              <Menu
                as='div'
                className='relative ml-4 md:ml-6'
              >
                <div>
                  <MenuButton className='relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                    <span className='absolute -inset-1.5' />
                    <span className='sr-only'>Open user menu</span>

                    <div className='flex items-center space-x-2'>
                      <p className='hidden lg:block'>{user.fullName.split(' ')[0] ?? user.fullName}</p>

                      <UserCircleIcon className='size-6 md:size-8' />
                    </div>
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
                >
                  <MenuItem>
                    <button
                      onClick={handleClickLogout}
                      className='w-full text-left block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none'
                      disabled={isPending || isSuccess}
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          ) : (
            <div className='hidden md:flex h-16 items-center justify-center sm:items-stretch sm:justify-start space-x-4'>
              <Link
                href='/login'
                className={`inline-flex items-center border-b-2 ${pathname === '/login' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700'}`}
              >
                Login
              </Link>

              <Link
                href='/register'
                className={`inline-flex items-center border-b-2 ${pathname === '/register' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700'}`}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      <DisclosurePanel className='lg:hidden'>
        <div className='space-y-1 pb-4 pt-2'>
          {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
          {(user === null ? [...links, ...authLinks] : links).map((link) => (
            <DisclosureButton
              key={link.url}
              href={link.url}
              as='a'
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${pathname === link.url ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`}
            >
              {link.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

export default Navbar
