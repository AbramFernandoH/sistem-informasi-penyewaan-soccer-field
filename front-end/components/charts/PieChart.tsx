'use client'
import React from 'react'

import { ApexOptions } from 'apexcharts'

import dynamic from 'next/dynamic'
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

export default function PieChart() {
  const options: ApexOptions = {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
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

  const series = [44, 55, 13, 43, 22]

  return (
    <div className='max-w-full overflow-x-auto custom-scrollbar'>
      <div
        id='chartEight'
        className='min-w-[1000px]'
      >
        <ReactApexChart
          options={options}
          series={series}
          type='pie'
          height={310}
        />
      </div>
    </div>
  )
}
