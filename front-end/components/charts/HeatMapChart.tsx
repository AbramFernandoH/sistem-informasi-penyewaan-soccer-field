'use client'
import { FC, useMemo } from 'react'
import { ApexOptions } from 'apexcharts'

import dynamic from 'next/dynamic'
import { DashboardTimeSlotUsage } from '@/utils/type'
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

type HeatMapChartProps = {
  data: DashboardTimeSlotUsage[]
}

const HeatMapChart: FC<HeatMapChartProps> = ({ data }) => {
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#008FFB'],
  }

  const series = useMemo(() => {
    if (data.length > 0) {
      return data.map((item) => ({
        name: item.dayName,
        data: item.data.map((val, idx) => ({
          x: idx + 7 < 10 ? `0${idx + 7}` : idx + 7,
          y: val,
        })),
      }))
    }

    return []
  }, data)

  return (
    <div className='max-w-full overflow-x-auto custom-scrollbar'>
      <div
        id='chartEight'
        className='w-full max-w-[calc(100vh-200px)] lg:max-w-[calc(100vw-450px)] min-w-[300px]'
      >
        <ReactApexChart
          options={options}
          series={series}
          type='heatmap'
          height={350}
        />
      </div>
    </div>
  )
}

export default HeatMapChart
