'use client'

import React, { FC, ReactNode, useEffect, useState } from 'react'
import {
  BanknotesIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartPieIcon,
  CreditCardIcon,
  HomeIcon,
  UsersIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Toaster } from 'react-hot-toast'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import { usePathname, useRouter } from 'next/navigation'
import SidebarMobile from '@/components/cms/SidebarMobile'
import SidebarDesktop from '@/components/cms/SidebarDesktop'
import MainSection from '@/components/cms/MainSection'
import { getCookie } from '@/utils/helper'
import { COOKIES } from '@/utils/constants'

type CMSLayoutProps = {
  pages?: BreadcrumbData[]
  children: ReactNode
}

const CMSLayout: FC<CMSLayoutProps> = ({ children, pages }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/cms/dashboard', icon: HomeIcon, current: pathname.includes('/cms/dashboard') },
    { name: 'Admin', href: '/cms/admins', icon: UserIcon, current: pathname.includes('/cms/admins') },
    { name: 'Lapangan', href: '/cms/fields', icon: UsersIcon, current: pathname.includes('/cms/fields') },
    { name: 'Jadwal', href: '/cms/schedules', icon: CalendarIcon, current: pathname.includes('/cms/schedules') },
    { name: 'Pengeluaran', href: '/cms/outcomes', icon: CreditCardIcon, current: pathname.includes('/cms/outcomes') },
    { name: 'Laporan', href: '/cms/reports', icon: ChartPieIcon, current: pathname.includes('/cms/reports') },
    { name: 'Pembayaran', href: '/cms/payments', icon: BanknotesIcon, current: pathname.includes('/cms/payments') },
    { name: 'Booking', href: '/cms/bookings', icon: BookOpenIcon, current: pathname.includes('/cms/bookings') },
  ]

  useEffect(() => {
    if (pathname !== '/cms/login') {
      const accessToken = getCookie(COOKIES.ADMIN_ACCESS_TOKEN)
      const refreshToken = getCookie(COOKIES.ADMIN_REFRESH_TOKEN)

      if (accessToken === null && refreshToken === null) {
        router.push('/cms/login')
      }
    }
  }, [pathname, router])

  return (
    <>
      <Toaster />

      <SidebarMobile
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <SidebarDesktop navigation={navigation} />

      <MainSection
        pages={pages}
        setSidebarOpen={setSidebarOpen}
      >
        {children}
      </MainSection>
    </>
  )
}

export default CMSLayout
