import { FC, ReactNode } from 'react'

type DetailCardProps = {
  title: string
  children: ReactNode
  wrapperClassName?: string
}

const DetailCard: FC<DetailCardProps> = ({ wrapperClassName, children, title }) => {
  return (
    <div className={`mt-6 shadow-md border border-solid border-gray-300 rounded-lg w-full ${wrapperClassName}`}>
      <div className='p-4 box-border border-b border-solid border-gray-300'>
        <h2 className='font-bold text-lg'>{title}</h2>
      </div>

      <div className='px-4 py-6 box-border flex flex-col space-y-8 divider-y divider-gray-300'>{children}</div>
    </div>
  )
}

export default DetailCard
