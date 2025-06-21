'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ReactNode, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Field, ListFieldRequest, ListFieldResponse } from '@/utils/type'
import DeleteModal from '@/components/DeleteModal'
import { fetchWithAuth, formatToRupiah } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'

export default function Field() {
  const queryClient = useQueryClient()

  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [selectedField, setSelectedField] = useState<Field | null>(null)

  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Lapangan', path: '/cms/fields', current: true }]
  const tableHeaders = ['Nama Lapangan', 'Harga', 'Action']

  const { data: dataListField, isSuccess: isSuccessListField } = useQuery<ListFieldRequest, unknown, ListFieldResponse>(
    {
      queryKey: ['field', skip],
      refetchOnWindowFocus: false,
      queryFn: async () => {
        const res = await fetchWithAuth('cms', `${ENV.API_URL}/fields?skip=${skip}`)

        if (!res.ok) {
          const errorData = await res.json()

          throw new Error(errorData.message || 'Failed to get list field')
        }

        return res.json()
      },
    }
  )

  const {
    isPending: isPendingDeleteField,
    isSuccess: isSuccessDeleteField,
    reset: resetDeleteField,
    mutate: mutateDeleteField,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/fields/${selectedField?._id ?? ''}`, {
        method: 'DELETE',
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Delete field failed')
      }

      return json
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['field'] })

      toast.success('Hapus lapangan berhasil')

      setIsOpenDeleteModal(false)
      setSelectedField(null)

      resetDeleteField()
    },
    onError: () => {
      toast.error('Gagal hapus lapangan')
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

  const handleClickOpenDeleteModal = (field: Field) => () => {
    setIsOpenDeleteModal(true)

    setSelectedField(field)
  }

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false)
  }

  const handleClickDelete = () => {
    mutateDeleteField()
  }

  useEffect(() => {
    if (isSuccessListField) {
      setTableData(
        dataListField.data.items.map((item) => [
          item.name,
          formatToRupiah(item.pricePerHour),
          <div
            key={item._id}
            className='flex items-center space-x-2'
          >
            <Link
              href={`/cms/fields/${item._id}/edit`}
              className='w-fit flex items-center space-x-2 rounded-md bg-orange-500 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              <PencilIcon className='size-3' />

              <span>Edit</span>
            </Link>

            {dataListField.data.items.length > 1 && (
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
  }, [dataListField?.data.items, isSuccessListField])

  return (
    <>
      <CMSLayout pages={breadcrumbsPages}>
        <Table
          title='List Lapangan'
          description='list manajemen lapangan'
          addButton={{
            path: '/cms/fields/create',
          }}
          headers={tableHeaders}
          data={tableData}
          totalData={dataListField?.data.metadata.count ?? 0}
          currentPage={page}
          handleClickPrev={handleClickPrev}
          handleClickNext={handleClickNext}
        />
      </CMSLayout>

      <DeleteModal
        text={selectedField?.name ?? ''}
        isOpen={isOpenDeleteModal}
        closeModal={handleCloseDeleteModal}
        disabled={isPendingDeleteField || isSuccessDeleteField}
        action={handleClickDelete}
      />
    </>
  )
}
