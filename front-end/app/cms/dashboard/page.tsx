'use client'
import CMSLayout from '@/layouts/cms'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import PieChart from '@/components/charts/PieChart'
import HeatMapChart from '@/components/charts/HeatMapChart'
import ComponentCard from '@/components/cms/Card'

export default function Dashboard() {
  return (
    <CMSLayout>
      <div className='space-y-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>Dashboard</h1>

        <ComponentCard title='Jumlah Booking'>
          <BarChart />
        </ComponentCard>

        <ComponentCard title='Pendapatan Booking'>
          <LineChart />
        </ComponentCard>

        <ComponentCard title='Lapangan Terfavorit'>
          <PieChart />
        </ComponentCard>

        <ComponentCard title='Jam Tersibuk per hari'>
          <HeatMapChart />
        </ComponentCard>
      </div>
    </CMSLayout>
  )
}
