'use client'
import React, { useEffect } from 'react'
import Callback from '@/components/Callback'
import { useMutation } from '@tanstack/react-query'
import { ENV } from '@/utils/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { BaseResponse } from '@/utils/type'

const VerifyEmailUser = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { mutate } = useMutation<void, BaseResponse>({
    mutationKey: ['verify-email'],
    mutationFn: async () => {
      const token = searchParams.get('token')
      const response = await fetch(`${ENV.API_URL}/auth/verify-email?token=${token}`)

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Register failed')
      }

      return json
    },
    onSuccess: async () => {
      toast.success('Daftar akun berhasil')

      router.push('/login')
    },
    onError: (err) => {
      if (err.message === 'Token expired' || err.message === 'User not found') {
        if (err.message === 'Token expired') {
          toast.error('Token anda telah hangus, silahkan registrasi ulang', { duration: 10000 })
        }

        router.push('/register')
      }
    },
  })

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      mutate()
    }
    // eslint-disable-next-line
  }, [])

  return <Callback text='Memverifikasi email anda, mohon tunggu sebentar...' />
}

export default VerifyEmailUser
