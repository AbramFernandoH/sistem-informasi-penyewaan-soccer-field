import { FC } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

type HeaderProps = {
  title: string
  backUrl: string
}

const Header: FC<HeaderProps> = ({ title, backUrl }) => {
  return (
    <section className='flex items-center space-x-4'>
      <Link href={backUrl}>
        <ArrowLeftIcon className='size-6 font-bold text-gray-900 hover:cursor-pointer' />
      </Link>

      <h1 className='text-2xl font-semibold text-gray-900'>{title}</h1>
    </section>
  )
}

export default Header
