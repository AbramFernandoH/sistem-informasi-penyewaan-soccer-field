'use client'
import { FC, ReactNode } from 'react'
import Link from 'next/link'

import { PlusIcon } from '@heroicons/react/24/outline'
import Pagination from '@/components/cms/Pagination'
import EmptyState from '@/components/cms/EmptyState'

export type TableProps = {
  title: string
  description: string
  headers: string[]
  data: (string | ReactNode)[][]
  addButton?: {
    path: string
    text?: string
  }
  totalData?: number
  currentPage?: number
  emptyStateText?: string
  handleClickPrev?: () => void
  handleClickNext?: () => void
}

const Table: FC<TableProps> = ({
  title,
  description,
  addButton,
  headers,
  data,
  currentPage = 1,
  totalData = 0,
  emptyStateText,
  handleClickPrev = () => {},
  handleClickNext = () => {},
}) => {
  return (
    <>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-2xl font-semibold text-gray-900'>{title}</h1>

          <p className='mt-2 text-base text-gray-700'>{description}</p>
        </div>

        {addButton && (
          <div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
            <Link
              href={addButton.path}
              className='flex justify-center items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              <PlusIcon className='size-5' />

              <span>{addButton.text ?? 'Tambah'}</span>
            </Link>
          </div>
        )}
      </div>

      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            {data.length > 0 ? (
              <table className='min-w-full divide-y divide-gray-300'>
                <thead>
                  <tr>
                    {headers.map((header, idx) => (
                      <th
                        key={`${idx}-${header}`}
                        scope='col'
                        className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 ${idx === 0 ? 'sm:pl-0' : idx + 1 === headers.length ? 'py-3.5 pl-3 pr-4 sm:pr-0' : ''}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className='divide-y divide-gray-200'>
                  {data.map((tableData, idx) => (
                    <tr key={idx}>
                      {tableData.map((t, tIdx) => (
                        <td
                          key={`${idx}-${tIdx}`}
                          className={`whitespace-nowrap py-4 pl-4 ${tIdx === 0 ? 'pr-3 sm:pl-0' : tIdx + 1 === data.length ? 'pl-3 pr-4 sm:pr-0' : ''} text-sm font-medium text-gray-500`}
                        >
                          {t}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState
                addUrl={addButton?.path ?? '/cms/dashboard'}
                text={emptyStateText}
              />
            )}
          </div>
        </div>
      </div>

      {totalData > 10 && (
        <Pagination
          limit={10}
          total={totalData}
          currentPage={currentPage}
          handleClickPrev={handleClickPrev}
          handleClickNext={handleClickNext}
        />
      )}
    </>
  )
}

export default Table
