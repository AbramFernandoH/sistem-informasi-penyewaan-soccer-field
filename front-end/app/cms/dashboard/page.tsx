'use client'
import CMSLayout from '@/layouts/cms'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import HeatMapChart from '@/components/charts/HeatMapChart'
import ComponentCard from '@/components/cms/Card'
import { useMemo, useState } from 'react'
import DashboardFilter from '@/components/cms/DashboardFilter'
import { useQuery } from '@tanstack/react-query'
import { DashboardResponse } from '@/utils/type'
import { ENV } from '@/utils/constants'
import { addDotsToNumber, fetchWithAuth } from '@/utils/helper'
import Shimmer from '@/components/Shimmer'
import BarChartBookingIncome from '@/components/charts/BarChartBookingIncome'
import DashboardInfosCard, { DashboardStats } from '@/components/DashboardInfosCard'

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<3 | 6 | 12>(3)

  const { data, isPending } = useQuery<unknown, unknown, DashboardResponse>({
    queryKey: ['dashboard', selectedMonth],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/dashboard?months=${selectedMonth}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get dashboard data')
      }

      return res.json()
    },
  })

  const stats: DashboardStats[] = useMemo(() => {
    if (data && data.data) {
      const entries = Object.entries(data.data.dataSummary)

      return entries.map((entry, idx) => ({
        name: idx === 0 ? 'Total Booking' : idx === 1 ? 'Total Pemasukan' : 'Total Pengeluaran',
        value: idx === 0 ? addDotsToNumber(entry[1]) : `Rp ${addDotsToNumber(entry[1])}`,
      }))
    }

    return []
  }, [data])

  const handleClickMonth = (month: 3 | 6 | 12) => () => {
    setSelectedMonth(month)
  }

  return (
    <CMSLayout>
      <div className='space-y-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>Dashboard</h1>

        <DashboardFilter
          active={selectedMonth}
          handleClickMonth={handleClickMonth}
        />

        {!isPending && data && data.data ? (
          <>
            <DashboardInfosCard stats={stats} />

            <ComponentCard title='Jumlah Booking'>
              <BarChart data={data.data.monthlySummary} />
            </ComponentCard>

            <ComponentCard title='Pendapatan Booking'>
              <BarChartBookingIncome data={data.data.monthlySummary} />
            </ComponentCard>

            <ComponentCard title='Lapangan Terfavorit'>
              <PieChart data={data.data.fieldSummary} />
            </ComponentCard>

            <ComponentCard title='Jam Tersibuk per hari'>
              <HeatMapChart data={data.data.timeSlotUsage} />
            </ComponentCard>
          </>
        ) : (
          <>
            <div className='flex items-center justify-between space-x-6'>
              {[1, 2, 3].map((_, idx) => (
                <Shimmer
                  key={`data-${idx}`}
                  className='grow h-[120px]'
                />
              ))}
            </div>

            <Shimmer className='w-full h-[320px]' />

            <Shimmer className='w-full h-[420px]' />

            <Shimmer className='w-full h-[430px]' />

            <Shimmer className='w-full h-[480px]' />
          </>
        )}
      </div>
    </CMSLayout>
  )
}
