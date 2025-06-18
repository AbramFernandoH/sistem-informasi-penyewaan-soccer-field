'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import DayCalendar from '@/components/cms/DayCalendar'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { id as indonesianLocale } from 'date-fns/locale/id'
import { useQuery } from '@tanstack/react-query'
import { DetailFieldResponse, ListScheduleRequest, ListScheduleResponse, Schedule } from '@/utils/type'
import { fetchWithAuth } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import { useEffect, useState } from 'react'

export default function Field() {
  const params = useParams()

  const [fieldName, setFieldName] = useState(String(params.fieldId))
  const [schedules, setSchedules] = useState<Schedule[]>([])

  const { data: dataDetailField, isSuccess: isSuccessDetailField } = useQuery<unknown, unknown, DetailFieldResponse>({
    queryKey: ['field'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/fields/${params.fieldId}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get detail field')
      }

      return res.json()
    },
  })

  const { data: dataListSchedule, isSuccess: isSuccessListSchedule } = useQuery<
    ListScheduleRequest,
    unknown,
    ListScheduleResponse
  >({
    queryKey: ['schedule'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/schedules?date=${params.date}&fieldId=${params.fieldId}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list schedule')
      }

      return res.json()
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Jadwal', path: '/cms/schedules', current: false },
    {
      name: format(String(params.date), 'd MMMM yyyy', { locale: indonesianLocale }),
      path: `/cms/schedules/${String(params.date)}`,
      current: false,
    },
    { name: fieldName, path: '/', current: true },
  ]

  useEffect(() => {
    if (isSuccessDetailField && dataDetailField && dataDetailField.data) {
      setFieldName(dataDetailField.data.name)
    }
  }, [dataDetailField, isSuccessDetailField])

  useEffect(() => {
    if (isSuccessListSchedule && dataListSchedule && dataListSchedule.data) {
      setSchedules(dataListSchedule.data.items)
    }
  }, [dataListSchedule, isSuccessListSchedule])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <DayCalendar schedules={schedules} />
    </CMSLayout>
  )
}
