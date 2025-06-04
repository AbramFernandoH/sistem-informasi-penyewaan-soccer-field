'use client'

import React, { FC, ReactNode, useState } from 'react'
import { CalendarIcon, ChartPieIcon, HomeIcon, UsersIcon, UserIcon } from '@heroicons/react/24/outline'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import { usePathname } from 'next/navigation'
import SidebarMobile from '@/components/cms/SidebarMobile'
import SidebarDesktop from '@/components/cms/SidebarDesktop'
import MainSection from '@/components/cms/MainSection'

type CMSLayoutProps = {
  pages?: BreadcrumbData[]
  children: ReactNode
}

const CMSLayout: FC<CMSLayoutProps> = ({ children, pages }) => {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/cms/dashboard', icon: HomeIcon, current: pathname.includes('/cms/dashboard') },
    { name: 'Admin', href: '/cms/admins', icon: UserIcon, current: pathname.includes('/cms/admins') },
    { name: 'Pengguna', href: '/cms/users', icon: UserIcon, current: pathname.includes('/cms/users') },
    { name: 'Lapangan', href: '/cms/fields', icon: UsersIcon, current: pathname.includes('/cms/fields') },
    { name: 'Jadwal', href: '/cms/schedules', icon: CalendarIcon, current: pathname.includes('/cms/schedules') },
    { name: 'Laporan', href: '/cms/reports', icon: ChartPieIcon, current: pathname.includes('/cms/reports') },
  ]

  return (
    <>
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
