'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import DayCalendar from '@/components/cms/DayCalendar'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { id as indonesianLocale } from 'date-fns/locale/id'

export default function Field() {
  const params = useParams()

  // TODO: change current breadcrumb page name using name instead of id
  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Jadwal', path: '/cms/schedules', current: false },
    {
      name: format(String(params.date), 'd MMMM yyyy', { locale: indonesianLocale }),
      path: `/cms/schedules/${String(params.date)}`,
      current: false,
    },
    { name: String(params.fieldId), path: '/', current: true },
  ]

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <DayCalendar />
    </CMSLayout>
  )
}
