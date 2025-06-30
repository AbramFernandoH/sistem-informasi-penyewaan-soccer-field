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

export type LineChartProps = {
  data: DashboardMonthlySummary[]
}

const LineChart: FC<LineChartProps> = ({ data }) => {
  const monthData = useMemo(() => {
    if (data.length > 0) {
      return data.map((summary) => INDONESIAN_MONTHS[summary.month - 1])
    }

    return []
  }, data)

  const totalRevenueData = useMemo(() => {
    if (data.length > 0) {
      return data.map((summary) => summary.totalRevenue)
    }

    return []
  }, data)

  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#465FFF', '#9CB9FF'], // Define line colors
    chart: {
      fontFamily: 'Outfit, sans-serif',
      height: 310,
      type: 'line', // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: 'straight', // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: '#fff', // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: 'dd MMM yyyy', // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: 'category', // Category-based x-axis
      categories: monthData,
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px', // Adjust font size for y-axis labels
          colors: ['#6B7280'], // Color of the labels
        },
      },
      title: {
        text: '', // Remove y-axis title
        style: {
          fontSize: '0px',
        },
      },
    },
  }

  const series = [
    {
      name: 'Total Booking',
      data: totalRevenueData,
    },
  ]

  return (
    <div className='max-w-full overflow-x-auto custom-scrollbar'>
      <div
        id='chartEight'
        className='min-w-[1000px]'
      >
        <ReactApexChart
          options={options}
          series={series}
          type='area'
          height={310}
        />
      </div>
    </div>
  )
}

export default LineChart
