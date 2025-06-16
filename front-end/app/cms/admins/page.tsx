'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ReactNode, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Admin, ListAdminRequest, ListAdminResponse } from '@/utils/type'
import { fetchWithAuth } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import DeleteModal from '@/components/DeleteModal'
import toast from 'react-hot-toast'
import { adminProfileStore } from '@/stores/adminProfile'

export default function Admin() {
  const queryClient = useQueryClient()

  const adminProfile = adminProfileStore((state) => state.admin)

  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)

  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Admin', path: '/cms/admins', current: true }]
  const tableHeaders = ['Nama Lengkap', 'Username', 'Action']

  const { data: dataListAdmin, isSuccess: isSuccessListAdmin } = useQuery<ListAdminRequest, unknown, ListAdminResponse>(
    {
      queryKey: ['admin', skip],
      refetchOnWindowFocus: false,
      queryFn: async () => {
        const res = await fetchWithAuth('cms', `${ENV.API_URL}/admins?skip=${skip}`)

        if (!res.ok) {
          const errorData = await res.json()

          throw new Error(errorData.message || 'Failed to get list admin')
        }

        return res.json()
      },
    }
  )

  const {
    isPending: isPendingDeleteAdmin,
    isSuccess: isSuccessDeleteAdmin,
    reset: resetDeleteAdmin,
    mutate: mutateDeleteAdmin,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/admins/${selectedAdmin?.username ?? ''}`, {
        method: 'DELETE',
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Delete admin failed')
      }

      return json
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['admin'] })

      toast.success('Hapus admin berhasil')

      setIsOpenDeleteModal(false)
      setSelectedAdmin(null)

      resetDeleteAdmin()
    },
    onError: () => {
      toast.error('Gagal hapus admin')
    },
  })

  const handleClickPrev = () => {
    setSkip(skip > 0 ? skip - 10 : 0)
    setPage(page > 1 ? page - 1 : 1)
  }

  const handleClickNext = () => {
    setSkip(skip + 10)
    setPage(page + 1)
  }

  const handleClickOpenDeleteModal = (admin: Admin) => () => {
    setIsOpenDeleteModal(true)

    setSelectedAdmin(admin)
  }

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false)
  }

  const handleClickDelete = () => {
    mutateDeleteAdmin()
  }

  useEffect(() => {
    if (isSuccessListAdmin) {
      setTableData(
        dataListAdmin.data.items.map((item) => [
          item.fullName,
          item.username,
          <div
            key={item._id}
            className='flex items-center space-x-2'
          >
            <Link
              href={`/cms/admins/${item.username}/edit`}
              className='w-fit flex items-center space-x-2 rounded-md bg-orange-500 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              <PencilIcon className='size-3' />

              <span>Edit</span>
            </Link>

            {((adminProfile && adminProfile._id !== item._id) || adminProfile === null) &&
              dataListAdmin.data.items.length > 1 && (
                <button
                  className='w-fit flex items-center space-x-2 rounded-md bg-red-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
                  onClick={handleClickOpenDeleteModal(item)}
                >
                  <TrashIcon className='size-3' />

                  <span>Hapus</span>
                </button>
              )}
          </div>,
        ])
      )
    }
  }, [adminProfile, dataListAdmin?.data.items, isSuccessListAdmin])

  return (
    <>
      <CMSLayout pages={breadcrumbsPages}>
        <Table
          title='List Admin'
          description='list manajemen admin'
          addButton={{
            path: '/cms/admins/create',
          }}
          headers={tableHeaders}
          data={tableData}
          totalData={dataListAdmin?.data.metadata.count ?? 0}
          currentPage={page}
          handleClickPrev={handleClickPrev}
          handleClickNext={handleClickNext}
        />
      </CMSLayout>

      <DeleteModal
        text={selectedAdmin?.fullName ?? ''}
        isOpen={isOpenDeleteModal}
        closeModal={handleCloseDeleteModal}
        disabled={isPendingDeleteAdmin || isSuccessDeleteAdmin}
        action={handleClickDelete}
      />
    </>
  )
}
