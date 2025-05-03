import NextImg from "next/image";
import Link from 'next/link';

const Navbar = () => {
  const links = [
    {
      url: '/',
      name: 'Home',
    },
    {
      url: '/about',
      name: 'Tentang Kami',
    },
    {
      url: '/contact-us',
      name: 'Kontak',
    }
  ]

  return (
    <nav className="bg-primary flex items-center justify-between p-4 lg:px-20 box-border fixed top-0 left-0 w-full">
      <div className='flex items-center lg:space-x-8'>
        <NextImg
          src='/goedang-futsal-icon.png'
          alt='goedang-futsal-icon'
          width={50}
          height={50}
        />

        <div className='hidden lg:flex items-center space-x-4'>
          {links.map((data, idx) => (
            <Link
              key={idx}
              href={data.url}
              className='p-2 box-border border-b border-solid border-b-secondary group transition-all duration-300 hover:rounded hover:bg-secondary hover:cursor-pointer'
            >
              <p className='text-footer group-hover:text-primary text-sm'>{data.name}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className='flex items-center lg:space-x-4'>
        
      </div>
    </nav>
  );
};

export default Navbar;