import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart } from '@/utils/type'

type CartStore = {
  cart: Cart[]
  addCartItem: (data: Cart) => void
  deleteCartItem: (cartId: string) => void
  resetCart: () => void
}

export const cartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: get()?.cart || [],
      addCartItem: (item: Cart) => {
        set((state) => ({
          cart: [...state.cart, item],
        }))
      },
      deleteCartItem: (cartId: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.cartId !== cartId),
        }))
      },
      resetCart: () => {
        set(() => ({ cart: [] }))
      },
    }),
    {
      name: 'cart',
    }
  )
)
