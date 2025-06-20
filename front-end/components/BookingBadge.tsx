import { FC } from 'react'

type BookingBadgeProps = {
  status: 'pending' | 'half_paid' | 'fully_paid' | 'failure'
}

const BookingBadge: FC<BookingBadgeProps> = ({ status }) => {
  const background = {
    fully_paid: 'bg-green-500',
    half_paid: 'bg-gray-500',
    pending: 'bg-orange-500',
    failure: 'bg-red-500',
  }

  const text = {
    fully_paid: 'Lunas',
    half_paid: 'DP Lunas',
    pending: 'Pending',
    failure: 'Gagal',
  }

  return (
    <div className={`${background[status]} text-white text-xs px-2 py-1 box-border rounded-lg w-fit`}>
      {text[status]}
    </div>
  )
}

export default BookingBadge
