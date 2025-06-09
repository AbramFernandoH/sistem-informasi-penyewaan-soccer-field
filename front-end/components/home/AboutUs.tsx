import React from 'react'
import ballImage from '@/public/home-header-background.jpg'
import NextImg from 'next/image'

const AboutUs = () => {
  return (
    <section className='flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8 p-10 lg:p-20 box-border min-h-screen w-full max-w-screen-xl mx-auto'>
      <div className='w-full lg:w-1/2'>
        <NextImg
          src={ballImage}
          alt='ball-image'
          draggable='false'
        />
      </div>

      <div className='w-full lg:w-1/2 flex flex-col space-y-4 text-footer text-justify'>
        <h3 className='text-6xl font-bold'>Tentang Kami</h3>

        <p className='text-lg leading-[150%]'>
          Sudah lebih dari 12 tahun Goedang Futsal menjadi pilihan utama pecinta futsal di Jakarta Timur. Berlokasi
          strategis di Jalan Kalimalang, kami menyediakan 5 lapangan futsal berkualitas yang siap mendukung permainan
          terbaik Anda, baik untuk latihan rutin maupun pertandingan seru bersama tim.
        </p>
      </div>
    </section>
  )
}

export default AboutUs
