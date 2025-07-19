import { FC } from 'react'
import NextImg from 'next/image'
import ball from '@/public/pexels-rethaferguson-3621104.jpg'
import Spinner from '@/components/Spinner'

type Props = {
  text: string
}

const Callback: FC<Props> = ({ text }) => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='absolute w-full h-full z-[1] top-0 left-0'>
        <NextImg
          src={ball}
          alt='login-image'
          className='absolute inset-0 size-full object-cover'
          draggable='false'
        />
      </div>

      <div className='flex flex-col space-y-4 bg-white p-4 rounded-lg relative z-[2] w-full max-w-[calc(100vw-32px)] md:max-w-[500px]'>
        <div className='flex justify-center items-center space-x-3 rtl:space-x-reverse shrink-0 mb-4'>
          <NextImg
            src='/goedang-futsal-icon.png'
            alt='goedang-futsal-icon'
            width={50}
            height={50}
            draggable={false}
          />

          <p className='text-2xl font-semibold whitespace-nowrap'>Goedang Futsal</p>
        </div>

        <div className='flex space-x-2'>
          <Spinner />

          <p className='relative -top-1 min-[512px]:top-0 w-[calc(100%-28px)] md:w-fit'>{text}</p>
        </div>
      </div>
    </div>
  )
}

export default Callback
