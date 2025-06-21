import React, { FC } from 'react'
import { formatToRupiah } from '@/utils/helper'

export type SoccerFieldCardProps = {
  imgUrl: string
  title: string
  price: number
}

const SoccerFieldCard: FC<SoccerFieldCardProps> = ({ price, title, imgUrl }) => {
  return (
    <div className='group relative'>
      <img
        src={imgUrl}
        alt={`Foto ${title}`}
        className='aspect-square w-full rounded-md bg-white object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80'
        draggable='false'
      />

      <div className='mt-4 flex justify-between'>
        <div>
          <h3 className='text-sm text-gray-700'>{title}</h3>
        </div>

        <p className='text-sm font-medium text-gray-900'>{formatToRupiah(price)}</p>
      </div>
    </div>
  )
}

export default SoccerFieldCard
