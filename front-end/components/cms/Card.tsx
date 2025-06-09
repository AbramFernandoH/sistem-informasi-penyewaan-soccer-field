import { FC, ReactNode } from 'react'

type CardProps = {
  title: string
  children: ReactNode
}

const Card: FC<CardProps> = ({ title, children }) => {
  return (
    <div className='divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow'>
      <div className='px-4 py-5 sm:px-6'>
        <h3 className='truncate text-base/7 font-semibold'>{title}</h3>
      </div>

      <div className='px-4 py-5 sm:p-6'>{children}</div>
    </div>
  )
}

export default Card
