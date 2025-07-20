import { FC } from 'react'

export type DashboardStats = {
  name: string
  value: string
  unit?: string
}

type Props = {
  stats: DashboardStats[]
}

const DashboardInfosCard: FC<Props> = ({ stats }) => {
  return (
    <div className='flex items-center justify-between space-x-6 sm:grid-cols-2 lg:grid-cols-4 divider-x divider-gray-300'>
      {stats.map((stat) => (
        <div
          key={stat.name}
          className='bg-indigo-600 rounded-lg px-4 py-6 sm:px-6 lg:px-8 grow'
        >
          <p className='text-sm/6 font-medium text-white'>{stat.name}</p>

          <p className='mt-2 flex items-baseline gap-x-2'>
            <span className='text-4xl font-semibold tracking-tight text-white'>{stat.value}</span>
            {stat.unit ? <span className='text-sm text-gray-400'>{stat.unit}</span> : null}
          </p>
        </div>
      ))}
    </div>
  )
}

export default DashboardInfosCard
