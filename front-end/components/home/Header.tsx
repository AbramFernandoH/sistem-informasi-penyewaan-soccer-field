import React from 'react';

const Header = () => {
  return (
    <header className='flex flex-col space-y-4 justify-center items-center bg-[url("/home-background.jpeg")] bg-no-repeat bg-cover min-h-screen'>
      <h1 className='text-[36px] text-green-500 font-bold'>Goedang Futsal</h1>

      {/* TODO: add link for this button for redirect to cp */}
      <button
        type='button'
        className='bg-white hover:bg-slate-100 border border-solid border-green-500 rounded-lg p-2 box-border text-green-500 font-medium text-lg hover:cursor-pointer'
      >
        Kontak Sekarang
      </button>
    </header>
  );
};

export default Header;
