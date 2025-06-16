'use client'
import Blank from '@/layouts/blank'
import LoginUser from '@/components/auth/LoginUser'
import { useEffect } from 'react'
import { getCookie } from '@/utils/helper'
import { COOKIES } from '@/utils/constants'
import { usePathname, useRouter } from 'next/navigation'

export default function Login() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const accessToken = getCookie(COOKIES.USER_ACCESS_TOKEN)
    const refreshToken = getCookie(COOKIES.USER_REFRESH_TOKEN)

    if (accessToken !== null && refreshToken !== null) {
      router.push('/')
    }
  }, [pathname, router])

  return (
    <Blank>
      <LoginUser />
    </Blank>
  )
}
