'use client'
import { FC, useMemo } from 'react'

import { ApexOptions } from 'apexcharts'

import dynamic from 'next/dynamic'
import { DashboardMonthlySummary } from '@/utils/type'
import { INDONESIAN_MONTHS } from '@/utils/constants'
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

type BarChartProps = {
  data: DashboardMonthlySummary[]
}

const BarChart: FC<BarChartProps> = ({ data }) => {
  const monthData = useMemo(() => {
    if (data.length > 0) {
      return data.map((summary) => INDONESIAN_MONTHS[summary.month - 1])
    }

    return []
    // eslint-disable-next-line
  }, data)

  const totalBookingData = useMemo(() => {
    if (data.length > 0) {
      return data.map((summary) => summary.totalBookings)
    }

    return []
    // eslint-disable-next-line
  }, data)

  const options: ApexOptions = {
    colors: ['#465fff'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '39%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: monthData,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  }

  const series = [
    {
      name: 'Total Booking',
      data: totalBookingData,
    },
  ]

  return (
    <div className='max-w-full overflow-x-auto custom-scrollbar'>
      <div
        id='chartOne'
        className='min-w-[1000px]'
      >
        <ReactApexChart
          options={options}
          series={series}
          type='bar'
          height={180}
        />
      </div>
    </div>
  )
}

export default BarChart
