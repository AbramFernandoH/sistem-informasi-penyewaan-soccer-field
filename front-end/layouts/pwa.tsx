'use client'
import { FC, ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Script from 'next/script'
import { usePathname, useRouter } from 'next/navigation'
import { userProfileStore } from '@/stores/userProfile'

type PwaLayoutProps = {
  children: ReactNode
}

const PwaLayout: FC<PwaLayoutProps> = ({ children }) => {
  const { user } = userProfileStore((state) => state)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname.includes('/bookings') && user === null) {
      router.push('/')
    }
  }, [pathname, router, user])

  return (
    <>
      <Script src='https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js'></Script>

      <Toaster />

      <Navbar />

      {children}

      <Footer />
    </>
  )
}

export default PwaLayout
