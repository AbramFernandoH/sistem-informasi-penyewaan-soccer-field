'use client'
import { ApexOptions } from 'apexcharts'

import dynamic from 'next/dynamic'
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

export default function HeatMapChart() {
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

  const generateData = (value: number, { min, max }: { min: number; max: number }) => {
    const data: number[] = []

    for (let i = 0; i < value; i++) {
      const randomNumber = Math.floor(Math.random() * max)

      data.push(randomNumber < min ? min + 1 : randomNumber)
    }

    return data
  }

  const series = [
    {
      name: '07:00',
      data: generateData(15, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: 'Metric2',
      data: generateData(15, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: 'Metric3',
      data: generateData(15, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: 'Metric4',
      data: generateData(15, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: 'Metric5',
      data: generateData(15, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: 'Metric6',
      data: generateData(15, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: 'Metric7',
      data: generateData(15, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: 'Metric8',
      data: generateData(15, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: 'Metric9',
      data: generateData(15, {
        min: 0,
        max: 90,
      }),
    },
  ]

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
