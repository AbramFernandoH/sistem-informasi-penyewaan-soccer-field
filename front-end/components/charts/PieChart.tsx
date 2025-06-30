'use client'
import { FC, useMemo } from 'react'

import { ApexOptions } from 'apexcharts'

import dynamic from 'next/dynamic'
import { DashboardFieldSummary } from '@/utils/type'
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

type PieChartProps = {
  data: DashboardFieldSummary[]
}

const PieChart: FC<PieChartProps> = ({ data }) => {
  const fieldNamesData = useMemo(() => {
    if (data.length > 0) {
      return data.map((summary) => summary.name)
    }

    return []
  }, data)

  const bookingCountData = useMemo(() => {
    if (data.length > 0) {
      return data.map((summary) => summary.bookingCount)
    }

    return []
  }, data)

  const options: ApexOptions = {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: fieldNamesData,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }

  return (
    <div className='max-w-full overflow-x-auto custom-scrollbar'>
      <div
        id='chartEight'
        className='min-w-[1000px]'
      >
        <ReactApexChart
          options={options}
          series={bookingCountData}
          type='pie'
          height={310}
        />
      </div>
    </div>
  )
}

export default PieChart
