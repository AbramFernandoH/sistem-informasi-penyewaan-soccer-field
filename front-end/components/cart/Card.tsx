import { FC } from 'react'
import { format } from 'date-fns'
import { id as indonesianLocale } from 'date-fns/locale'
import { fetchWithAuth, formatToRupiah, timeSlotsString } from '@/utils/helper'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'

export type FieldCardProps = {
  id: string
  photoUrl: string
  fieldName: string
  orderDate: string
  timeSlots: number[]
  price: number
}

const Card: FC<FieldCardProps> = ({ photoUrl, fieldName, orderDate, timeSlots, price, id }) => {
  const queryClient = useQueryClient()

  // const deleteCartItem = cartStore((state) => state.deleteCartItem)

  const {
    isPending: isPendingDeleteCartItem,
    isSuccess: isSuccessDeleteCartItem,
    mutate: mutateDeleteCartItem,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth('pwa', `${ENV.API_URL}/carts/${id}`, {
        method: 'DELETE',
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Failed to delete item from cart')
      }

      return json
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['cart'] })

      toast.success('Berhasil menghapus item dari keranjang')

      // deleteCartItem(id)
    },
    onError: () => {
      toast.error('Gagal menghapus item dari keranjang')
    },
  })

  const handleClickDeleteCartItem = () => {
    mutateDeleteCartItem()
  }

  return (
    <div className='flex py-6 space-x-4 lg:space-x-6 w-full'>
      <img
        src={photoUrl}
        alt='example field photo'
        className='size-24 rounded-md object-cover sm:size-32'
        draggable='false'
      />

      <div className='flex justify-between grow'>
        <div className='flex flex-col space-y-2 text-sm'>
          <p>{fieldName}</p>

          <p>{format(new Date(orderDate), 'EEEE, dd MMMM yyyy', { locale: indonesianLocale })}</p>

          <p>{timeSlotsString(timeSlots)}</p>

          <p className='font-semibold'>{formatToRupiah(price)}</p>
        </div>

        <button
          className='bg-transparent p-2 text-sm text-red-500 font-semibold rounded-lg h-fit disabled:text-gray-400 disabled:cursor-not-allowed'
          onClick={handleClickDeleteCartItem}
          disabled={isPendingDeleteCartItem || isSuccessDeleteCartItem}
        >
          Hapus
        </button>
      </div>
    </div>
  )
}

export default Card
