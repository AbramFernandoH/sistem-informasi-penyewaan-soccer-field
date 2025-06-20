import React from 'react'
import clsx from 'clsx'

type ShimmerProps = {
  className?: string
  rounded?: boolean
}

const Shimmer: React.FC<ShimmerProps> = ({ className = 'h-4 w-full', rounded = true }) => {
  return (
    <div className={clsx('bg-gray-300 relative overflow-hidden', rounded ? 'rounded-md' : '', className)}>
      <div className='absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent' />
    </div>
  )
}

export default Shimmer
