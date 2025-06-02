import React from 'react'
import FieldCard from '@/components/cart/Card'

const CartList = () => {
  return (
    <div className='flex flex-col space-y-6 divide-y divide-gray-200 border-t border-b border-gray-200'>
      <FieldCard />
      <FieldCard />
      <FieldCard />
    </div>
  )
}

export default CartList
