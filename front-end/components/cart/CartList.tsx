'use client'
import { useEffect, useState } from 'react'
import FieldCard, { FieldCardProps } from '@/components/cart/Card'
import { useQuery } from '@tanstack/react-query'
import { ListCartResponse } from '@/utils/type'
import { fetchWithAuth } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import EmptyState from '@/components/cms/EmptyState'

const CartList = () => {
  const [listCart, setListCart] = useState<FieldCardProps[]>([])

  const { data: dataListCart, isSuccess: isSuccessListCart } = useQuery<unknown, unknown, ListCartResponse>({
    queryKey: ['cart'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('pwa', `${ENV.API_URL}/carts`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list cart')
      }

      return res.json()
    },
  })

  useEffect(() => {
    if (isSuccessListCart && dataListCart && dataListCart.data) {
      setListCart(
        dataListCart.data.items.map((item) => ({
          id: item.cartId,
          photoUrl: item.field.photo,
          fieldName: item.field.name,
          orderDate: item.orderDate,
          timeSlots: item.timeSlots,
          price: item.price,
          isUpfront: item.isUpfront,
        }))
      )
    }
  }, [isSuccessListCart, dataListCart])

  if (listCart.length === 0) {
    return (
      <EmptyState
        addUrl='/fields'
        text='Belum ada item di keranjang, ayo tambah pesanan sekarang'
      />
    )
  }

  return (
    <>
      <div className='flex flex-col space-y-6 divide-y divide-gray-200 border-t border-b border-gray-200'>
        {listCart.map((cart) => (
          <FieldCard
            key={cart.id}
            {...cart}
          />
        ))}
      </div>

      <button className='w-full lg:w-fit lg:self-end rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden'>
        Checkout
      </button>
    </>
  )
}

export default CartList
