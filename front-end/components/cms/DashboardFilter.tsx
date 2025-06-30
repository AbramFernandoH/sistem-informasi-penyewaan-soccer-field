import { FC } from 'react'

type DashboardFilterProps = {
  active: 3 | 6 | 12
  handleClickMonth: (month: 3 | 6 | 12) => () => void
}

const DashboardFilter: FC<DashboardFilterProps> = ({ active, handleClickMonth }) => {
  return (
    <div className='flex flex-col space-y-6 px-4 py-5 sm:px-6 border-b border-solid border-b-gray-400'>
      <h3 className='truncate text-lg font-semibold'>Filter</h3>

      <div className='flex items-center space-x-4'>
        <button
          type='button'
          className={`${active === 3 ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white border border-solid border-indigo-600 text-indigo-600 hover:text-indigo-400 hover:border-indigo-400'} rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          onClick={handleClickMonth(3)}
        >
          3 Bulan terakhir
        </button>

        <button
          type='button'
          className={`${active === 6 ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white border border-solid border-indigo-600 text-indigo-600 hover:text-indigo-400 hover:border-indigo-400'} rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          onClick={handleClickMonth(6)}
        >
          6 Bulan terakhir
        </button>

        <button
          type='button'
          className={`${active === 12 ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white border border-solid border-indigo-600 text-indigo-600 hover:text-indigo-400 hover:border-indigo-400'} rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          onClick={handleClickMonth(12)}
        >
          12 Bulan terakhir
        </button>
      </div>
    </div>
  )
}

export default DashboardFilter
