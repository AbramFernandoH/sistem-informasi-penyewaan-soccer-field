import React from 'react'
import field from '@/public/dummy-soccer-field.jpg'
import NextImg from 'next/image'

const Card = () => {
  return (
    <div className='flex py-6 space-x-4 lg:space-x-6 w-full'>
      <NextImg
        src={field}
        alt='example field photo'
        className='size-24 rounded-md object-cover sm:size-32'
        draggable='false'
      />

      <div className='flex justify-between grow'>
        <div className='flex flex-col space-y-2 text-sm'>
          <p>Lapangan 1</p>

          <p>Minggu, 31 Desember 2025</p>

          <p>08:00 - 10:00</p>

          <p className='font-semibold'>Rp 300.000</p>
        </div>

        <button className='bg-transparent p-2 text-sm text-red-500 font-semibold rounded-lg h-fit'>Hapus</button>
      </div>
    </div>
  )
}

export default Card
