import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/utils/type'

type UserProfile = User | null

type UserProfileStore = {
  user: UserProfile
  setUserProfile: (data: UserProfile) => void
  resetUserProfile: () => void
}

export const userProfileStore = create<UserProfileStore>()(
  persist(
    (set, get) => ({
      user: get()?.user || null,
      setUserProfile: (user: UserProfile) => {
        set((state) => ({ ...state, user }))
      },
      resetUserProfile: () => {
        set((state) => ({ ...state, user: null }))
      },
    }),
    {
      name: 'userProfile',
    }
  )
)
