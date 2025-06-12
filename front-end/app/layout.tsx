import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/app/providers'

export const metadata: Metadata = {
  title: 'Goedang Futsal',
  description: 'Goedang Futsal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='id'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
