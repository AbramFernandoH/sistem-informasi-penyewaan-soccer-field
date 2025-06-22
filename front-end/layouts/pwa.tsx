'use client'
import { FC, ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Script from 'next/script'
import { usePathname, useRouter } from 'next/navigation'
import { getCookie } from '@/utils/helper'
import { COOKIES } from '@/utils/constants'

type PwaLayoutProps = {
  children: ReactNode
}

const PwaLayout: FC<PwaLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const accessToken = getCookie(COOKIES.USER_ACCESS_TOKEN)
    const refreshToken = getCookie(COOKIES.USER_ACCESS_TOKEN)

    if (pathname.includes('/bookings') && accessToken === null && refreshToken === null) {
      router.push('/')
    }
  }, [pathname, router])

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
