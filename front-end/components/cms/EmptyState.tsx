import { PlusIcon } from '@heroicons/react/20/solid'
import { FolderPlusIcon } from '@heroicons/react/24/outline'
import { FC } from 'react'
import Link from 'next/link'

type EmptyStateProps = {
  text?: string
  addUrl: string
}

const EmptyState: FC<EmptyStateProps> = ({ addUrl, text }) => {
  return (
    <div className='min-h-[calc(100vh-400px)] flex flex-col items-center justify-center space-y-6 px-3'>
      <FolderPlusIcon className='size-12 text-gray-500' />

      <div className='flex flex-col space-y-2 text-center'>
        <h3 className='text-xl font-semibold text-gray-900'>Belum ada data</h3>

        <p className='text-base text-gray-500'>
          {text ?? 'Mulai buat data baru sekarang, dengan klik tombol di bawah ini.'}
        </p>
      </div>

      <Link
        href={addUrl}
        className='flex justify-center items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        <PlusIcon className='size-5' />

        <span>Tambah</span>
      </Link>
    </div>
  )
}

export default EmptyState
