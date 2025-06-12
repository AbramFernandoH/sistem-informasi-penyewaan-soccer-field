import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Admin } from '@/utils/type'

type AdminProfile = Admin | null

type AdminProfileStore = {
  admin: AdminProfile
  setAdminProfile: (data: AdminProfile) => void
}

export const adminProfileStore = create<AdminProfileStore>()(
  persist(
    (set, get) => ({
      admin: get()?.admin || null,
      setAdminProfile: (admin: AdminProfile) => {
        set((state) => ({ ...state, admin }))
      },
    }),
    {
      name: 'adminProfile',
    }
  )
)
