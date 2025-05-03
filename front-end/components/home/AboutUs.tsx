import React from 'react';
import ballImage from '@/public/home-header-background.jpg'
import NextImg from "next/image";

const AboutUs = () => {
  return (
    <section className='flex items-center space-x-8 p-20 box-border min-h-screen w-full max-w-screen-xl mx-auto'>
      <div className='w-1/2'>
        <NextImg
          src={ballImage}
          alt='ball-image'
          draggable='false'
        />
      </div>

      <div className='w-1/2 flex flex-col space-y-4 text-footer text-justify'>
        <h3 className='text-6xl font-bold'>Tentang Kami</h3>

        <p className='text-lg leading-[150%]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam beatae commodi culpa delectus eaque labore obcaecati porro quisquam quod quos.</p>
      </div>
    </section>
  );
};

export default AboutUs;
