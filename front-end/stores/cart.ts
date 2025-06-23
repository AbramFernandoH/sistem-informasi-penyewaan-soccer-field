import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart } from '@/utils/type'

type CartStore = {
  cart: Cart[]
  addCartItem: (data: Cart) => void
  deleteCartItem: (cartId: string) => void
  setCartItems: (data: Cart[]) => void
  resetCart: () => void
}

export const cartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: get()?.cart || [],
      addCartItem: (item: Cart) => {
        set((state) => ({
          ...state,
          cart: [...state.cart, item],
        }))
      },
      deleteCartItem: (cartId: string) => {
        set((state) => ({
          ...state,
          cart: state.cart.filter((item) => item.cartId !== cartId),
        }))
      },
      setCartItems: (cart: Cart[]) => {
        set((state) => ({
          ...state,
          cart,
        }))
      },
      resetCart: () => {
        set((state) => ({ ...state, cart: [] }))
      },
    }),
    {
      name: 'cart',
    }
  )
)
