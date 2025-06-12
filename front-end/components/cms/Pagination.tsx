'use client'
import { FC } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid'

type PaginationProps = {
  limit: number
  total: number
  currentPage: number
  handleClickPrev: () => void
  handleClickNext: () => void
}

const Pagination: FC<PaginationProps> = ({ limit, total, currentPage, handleClickPrev, handleClickNext }) => {
  return (
    <nav
      aria-label='Pagination'
      className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'
    >
      <div className='hidden sm:block'>
        <p className='text-sm text-gray-700'>
          Showing <span className='font-medium'>1</span> to <span className='font-medium'>{limit}</span> of{' '}
          <span className='font-medium'>{total}</span> results
        </p>
      </div>
      <div className='flex flex-1 justify-between sm:justify-end'>
        <button
          className='relative inline-flex items-center rounded-md bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:bg-gray-200 disabled:hover:cursor-not-allowed'
          onClick={handleClickPrev}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon className='size-4 text-gray-900' />
        </button>

        <p className='relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900'>
          {currentPage}
        </p>

        <button
          className='relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:bg-gray-200 disabled:hover:cursor-not-allowed'
          onClick={handleClickNext}
          disabled={currentPage * 10 + 10 > total}
        >
          <ArrowRightIcon className='size-4 text-gray-900' />
        </button>
      </div>
    </nav>
  )
}

export default Pagination
