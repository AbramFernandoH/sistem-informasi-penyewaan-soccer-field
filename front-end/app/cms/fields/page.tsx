'use client'
import CMSLayout from '@/layouts/cms'
import Table, { TableHeader } from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'

export default function Field() {
  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Lapangan', path: '/cms/fields', current: true }]
  const tableHeaders: TableHeader[] = [{ name: 'Nama Lapangan' }, { name: 'Harga' }, { name: 'Action' }]

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Table
        title='List Lapangan'
        description='list manajemen lapangan'
        addButton={{
          path: '/cms/fields/create',
        }}
        headers={tableHeaders}
        data={[
          { name: 'Admin1', email: 'admin1@mail.com' },
          { name: 'Admin1', email: 'admin1@mail.com' },
          { name: 'Admin1', email: 'admin1@mail.com' },
        ]}
      />
    </CMSLayout>
  )
}
