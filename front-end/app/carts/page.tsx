import PwaLayout from '@/layouts/pwa'
import CartList from '@/components/cart/CartList'
import React from 'react'

export default function Cart() {
  return (
    <PwaLayout>
      <div className='w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 mx-auto flex flex-col space-y-6 mt-8 lg:mt-0'>
        <h2 className='text-2xl font-bold text-gray-900 text-center lg:text-3xl'>Keranjang</h2>

        <CartList />

        <button className='w-full lg:w-fit lg:self-end rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden'>
          Checkout
        </button>
      </div>
    </PwaLayout>
  )
}
