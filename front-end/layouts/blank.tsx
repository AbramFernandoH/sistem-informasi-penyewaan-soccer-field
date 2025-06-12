import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

type BlankLayoutProps = {
  children: ReactNode
}

const Blank: FC<BlankLayoutProps> = ({ children }) => {
  return (
    <>
      <Toaster />

      {children}
    </>
  )
}

export default Blank
