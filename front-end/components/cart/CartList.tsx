'use client'
import { useEffect, useState } from 'react'
import FieldCard, { FieldCardProps } from '@/components/cart/Card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateBookingRequest, CreateBookingResponse, ListCartResponse } from '@/utils/type'
import { fetchWithAuth, hasTimeSlotStarted } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import EmptyState from '@/components/cms/EmptyState'
import { userProfileStore } from '@/stores/userProfile'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cartStore } from '@/stores/cart'

const CartList = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const [listCart, setListCart] = useState<FieldCardProps[]>([])
  const [checkOutButtonDisabled, setCheckOutButtonDisabled] = useState(false)

  const { user } = userProfileStore((state) => state)
  const resetCart = cartStore((state) => state.resetCart)

  const { data: dataListCart, isSuccess: isSuccessListCart } = useQuery<unknown, unknown, ListCartResponse>({
    queryKey: ['cart'],
    refetchOnWindowFocus: false,
    enabled: user !== null,
    queryFn: async () => {
      const res = await fetchWithAuth('pwa', `${ENV.API_URL}/carts/${user?._id ?? ''}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list cart')
      }

      return res.json()
    },
  })

  const {
    isPending: isPendingCreateBooking,
    isSuccess: isSuccessCreateBooking,
    reset: resetCreateBooking,
    mutate: mutateCreateBooking,
  } = useMutation<CreateBookingResponse[], unknown, CreateBookingRequest[]>({
    mutationFn: async (cartItems) => {
      const results: CreateBookingResponse[] = []

      for (const data of cartItems) {
        const response = await fetchWithAuth('pwa', `${ENV.API_URL}/bookings/add-registered-first-transaction`, {
          method: 'POST',
          body: JSON.stringify(data),
        })

        const json = await response.json()

        results.push(json)
      }

      return results
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['booking'] })

      toast.success('Booking lapangan berhasil')

      resetCreateBooking()

      resetCart()

      router.push('/bookings')
    },
    onError: () => {
      toast.error('Gagal membuat booking lapangan')
    },
  })

  const handleClickCheckout = () => {
    mutateCreateBooking(listCart)
  }

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
          isAlreadyPassed: hasTimeSlotStarted(item.orderDate, item.timeSlots),
          name: item.name,
          email: item.email,
          telephoneNumber: item.telephoneNumber,
          field: item.field._id,
          user: item.user,
        }))
      )

      setCheckOutButtonDisabled(
        dataListCart.data.items.some((item) => hasTimeSlotStarted(item.orderDate, item.timeSlots))
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

      <button
        className='w-full lg:w-fit lg:self-end rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden disabled:bg-gray-200 disabled:text-white disabled:cursor-not-allowed'
        onClick={handleClickCheckout}
        disabled={checkOutButtonDisabled || isPendingCreateBooking || isSuccessCreateBooking}
      >
        Checkout
      </button>
    </>
  )
}

export default CartList
