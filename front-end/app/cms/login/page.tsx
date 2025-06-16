'use client'
import Blank from '@/layouts/blank'
import LoginAdmin from '@/components/auth/LoginAdmin'
import { useEffect } from 'react'
import { getCookie } from '@/utils/helper'
import { COOKIES } from '@/utils/constants'
import { usePathname, useRouter } from 'next/navigation'

export default function Login() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const accessToken = getCookie(COOKIES.ADMIN_ACCESS_TOKEN)
    const refreshToken = getCookie(COOKIES.ADMIN_REFRESH_TOKEN)

    if (accessToken !== null || refreshToken !== null) {
      router.push('/cms/dashboard')
    }
  }, [pathname, router])

  return (
    <Blank>
      <LoginAdmin />
    </Blank>
  )
}
