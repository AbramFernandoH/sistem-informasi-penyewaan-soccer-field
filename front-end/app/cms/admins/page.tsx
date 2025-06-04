'use client'
import CMSLayout from '@/layouts/cms'
import Table, { TableHeader } from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'

export default function Admin() {
  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Admin', path: '/cms/admins', current: true }]
  const tableHeaders: TableHeader[] = [{ name: 'Nama' }, { name: 'Email' }, { name: 'Action' }]

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Table
        title='List Admin'
        description='list manajemen admin'
        addButton={{
          path: '/cms/admins/create',
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
