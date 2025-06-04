import { Dispatch, FC, ForwardRefExoticComponent, RefAttributes, SetStateAction, SVGProps } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import NextImg from 'next/image'

type SidebarMobileProps = {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  navigation: {
    name: string
    href: string
    icon: ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, 'ref'> & {
        title?: string
        titleId?: string
      } & RefAttributes<SVGSVGElement>
    >
    current: boolean
  }[]
}

const SidebarMobile: FC<SidebarMobileProps> = ({ sidebarOpen, setSidebarOpen, navigation }) => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <Dialog
      open={sidebarOpen}
      onClose={setSidebarOpen}
      className='relative z-50 lg:hidden'
    >
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
      />

      <div className='fixed inset-0 flex'>
        <DialogPanel
          transition
          className='relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full'
        >
          <TransitionChild>
            <div className='absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0'>
              <button
                type='button'
                onClick={() => setSidebarOpen(false)}
                className='-m-2.5 p-2.5'
              >
                <span className='sr-only'>Close sidebar</span>
                <XMarkIcon
                  aria-hidden='true'
                  className='size-6 text-white'
                />
              </button>
            </div>
          </TransitionChild>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4'>
            <div className='flex h-16 shrink-0 items-center'>
              <NextImg
                src='/goedang-futsal-icon.png'
                alt='goedang-futsal-icon'
                width={50}
                height={50}
              />
            </div>
            <nav className='flex flex-1 flex-col'>
              <ul
                role='list'
                className='flex flex-1 flex-col gap-y-7'
              >
                <li>
                  <ul
                    role='list'
                    className='-mx-2 space-y-1'
                  >
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-indigo-700 text-white'
                              : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                          )}
                        >
                          <item.icon
                            aria-hidden='true'
                            className={classNames(
                              item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                              'size-6 shrink-0'
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default SidebarMobile
