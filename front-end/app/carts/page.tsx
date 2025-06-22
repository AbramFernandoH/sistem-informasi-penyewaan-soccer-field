import PwaLayout from '@/layouts/pwa'
import CartList from '@/components/cart/CartList'
import React from 'react'

export default function Cart() {
  return (
    <PwaLayout>
      <div className='w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 mx-auto flex flex-col space-y-6 mt-8 lg:mt-0 min-h-screen'>
        <h2 className='text-2xl font-bold text-gray-900 text-center lg:text-3xl'>Keranjang</h2>

        <CartList />
      </div>
    </PwaLayout>
  )
}
