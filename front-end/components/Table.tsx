import { FC, ReactNode } from 'react'
import EmptyState from '@/components/cms/EmptyState'
import Pagination from '@/components/cms/Pagination'

export type TableProps = {
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
  data,
  headers,
  addButton,
  emptyStateText,
  totalData = 0,
  currentPage = 1,
  handleClickPrev = () => {},
  handleClickNext = () => {},
}) => {
  return (
    <>
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
                          className={`py-4 pl-4 ${tIdx === 0 ? 'pr-3 sm:pl-0' : tIdx + 1 === data.length ? 'pl-3 pr-4 sm:pr-0' : ''} text-sm font-medium text-gray-500`}
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
                addUrl={addButton?.path}
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
