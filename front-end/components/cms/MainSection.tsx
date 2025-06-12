import { Dispatch, FC, ReactNode, SetStateAction } from 'react'
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Breadcrumbs, { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import { adminProfileStore } from '@/stores/adminProfile'

type MainSectionProps = {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  pages?: BreadcrumbData[]
  children: ReactNode
}

const MainSection: FC<MainSectionProps> = ({ setSidebarOpen, pages, children }) => {
  const userNavigation = [{ name: 'Sign out', href: '#' }]

  const admin = adminProfileStore((state) => state.admin)

  return (
    <div className='lg:pl-72'>
      <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
        <button
          type='button'
          onClick={() => setSidebarOpen(true)}
          className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
        >
          <span className='sr-only'>Open sidebar</span>
          <Bars3Icon
            aria-hidden='true'
            className='size-6'
          />
        </button>

        {/* Separator */}
        <div
          aria-hidden='true'
          className='h-6 w-px bg-gray-900/10 lg:hidden'
        />

        <div className='flex justify-end w-full'>
          <Menu
            as='div'
            className='relative'
          >
            <MenuButton className='-m-1.5 flex items-center p-1.5'>
              <span className='sr-only'>Open user menu</span>

              <UserCircleIcon className='size-8' />

              <span className='hidden lg:flex lg:items-center'>
                <span
                  aria-hidden='true'
                  className='ml-4 text-sm/6 font-semibold text-gray-900'
                >
                  {admin?.fullName ?? ''}
                </span>
                <ChevronDownIcon
                  aria-hidden='true'
                  className='ml-2 size-5 text-gray-400'
                />
              </span>
            </MenuButton>
            <MenuItems
              transition
              className='absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
            >
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  <a
                    href={item.href}
                    className='block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none'
                  >
                    {item.name}
                  </a>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>

      <main className='py-10 px-4 sm:px-6 lg:px-8'>
        {pages && (
          <div className='flex flex-col space-y-4 mb-8'>
            <Breadcrumbs pages={pages} />

            <hr className='w-full h-px border-t-solid border-t-gray-500 border-px' />
          </div>
        )}

        {children}
      </main>
    </div>
  )
}

export default MainSection
