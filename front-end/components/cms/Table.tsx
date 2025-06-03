'use client'
import { FC } from 'react'
import Link from 'next/link'

import {
  PlusIcon
} from '@heroicons/react/24/outline'
import Pagination from "@/components/cms/Pagination";

const people = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  // More people...
]

export type TableHeader = {
  name: string
}

export type DefaultTableData = Record<string, string>

export type TableProps<T = DefaultTableData> = {
  title: string
  description: string
  headers: TableHeader[]
  data: T[]
  addButton?: {
    path: string
    text?: string
  }
}

const Table: FC<TableProps> = ({ title, description, addButton, headers, data }) => {
  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

          <p className="mt-2 text-base text-gray-700">
            {description}
          </p>
        </div>

        {addButton && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href={addButton.path}
              className="flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className='size-5' />

              <span>{addButton.text ?? 'Tambah'}</span>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {headers.map((header, idx) => (
                    <th
                      key={`${idx}-${header.name}`}
                      scope="col"
                      className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 ${idx === 0 ? 'sm:pl-0' : idx + 1 === headers.length ? 'py-3.5 pl-3 pr-4 sm:pr-0' : ''}`}
                    >
                      {header.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data.map((tableData, idx) => (
                  <tr key={idx}>
                    <td className={`whitespace-nowrap py-4 pl-4 ${idx === 0 ? 'pr-3 sm:pl-0' : idx + 1 === data.length ? 'pl-3 pr-4 sm:pr-0' : ''} text-sm font-medium text-gray-500`}>
                      {/*{tableData ?? ''}*/}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Pagination limit={10} total={2} currentPage={1} handleClickPrev={() => {}} handleClickNext={() => {}} />
    </>
  )
}

export default Table
