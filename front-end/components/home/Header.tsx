'use client'

import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='flex justify-center items-center bg-[url("/home-background.jpeg")] bg-no-repeat bg-cover min-h-screen'>
      <div className='flex flex-col space-y-4 justify-center items-center p-6 rounded-lg bg-black/50 w-[calc(100%-30px)] md:w-fit'>
        <h1 className='text-[36px] text-green-500 font-bold'>Goedang Futsal</h1>

        <Link
          href='tel:0218509394'
          className='w-fit bg-white hover:bg-slate-100 border border-solid border-green-500 rounded-lg p-2 box-border text-green-500 font-medium text-lg hover:cursor-pointer'
        >
          Kontak Sekarang
        </Link>
      </div>
    </header>
  )
}

export default Header
