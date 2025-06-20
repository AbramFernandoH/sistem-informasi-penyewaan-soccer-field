import { FC } from 'react'

type PaymentBadgeProps = {
  status: 'pending' | 'success' | 'failure'
}

const PaymentBadge: FC<PaymentBadgeProps> = ({ status }) => {
  const background = {
    success: 'bg-green-500',
    pending: 'bg-orange-500',
    failure: 'bg-red-500',
  }

  const text = {
    success: 'Sukses',
    pending: 'Pending',
    failure: 'Gagal',
  }

  return (
    <div className={`${background[status]} text-white text-xs px-2 py-1 box-border rounded-lg w-fit`}>
      {text[status]}
    </div>
  )
}

export default PaymentBadge
