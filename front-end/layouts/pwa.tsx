import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Script from 'next/script'

type PwaLayoutProps = {
  children: ReactNode
}

const PwaLayout: FC<PwaLayoutProps> = ({ children }) => {
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
