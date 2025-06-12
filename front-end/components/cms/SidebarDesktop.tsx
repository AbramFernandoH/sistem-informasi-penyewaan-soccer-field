import { FC, ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
import NextImg from 'next/image'
import Link from 'next/link'

type SidebarDesktopProps = {
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

const SidebarDesktop: FC<SidebarDesktopProps> = ({ navigation }) => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
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
                    <Link
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
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default SidebarDesktop
