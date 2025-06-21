'use client'
import CMSLayout from '@/layouts/cms'
import Table from '@/components/cms/Table'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Link from 'next/link'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ListReportRequest, ListReportResponse, Report } from '@/utils/type'
import { fetchWithAuth, formatToRupiah } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import { ReactNode, useEffect, useState } from 'react'
import DeleteModal from '@/components/DeleteModal'
import toast from 'react-hot-toast'

export default function Reports() {
  const queryClient = useQueryClient()

  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const { data: dataListReport, isSuccess: isSuccessListReport } = useQuery<
    ListReportRequest,
    unknown,
    ListReportResponse
  >({
    queryKey: ['report', skip],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/reports?skip=${skip}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list report')
      }

      return res.json()
    },
  })

  const {
    isPending: isPendingDeleteReport,
    isSuccess: isSuccessDeleteReport,
    reset: resetDeleteReport,
    mutate: mutateDeleteReport,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/reports/${selectedReport?._id ?? ''}`, {
        method: 'DELETE',
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Delete report failed')
      }

      return json
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['report'] })

      toast.success('Hapus laporan berhasil')

      setIsOpenDeleteModal(false)
      setSelectedReport(null)

      resetDeleteReport()
    },
    onError: () => {
      toast.error('Gagal hapus laporan')
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [{ name: 'List Laporan', path: '/cms/reports', current: true }]
  const tableHeaders = ['Nama', 'Jenis', 'Jumlah', 'Action']

  const handleClickOpenDeleteModal = (report: Report) => () => {
    setIsOpenDeleteModal(true)

    setSelectedReport(report)
  }

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false)
  }

  const handleClickDelete = () => {
    mutateDeleteReport()
  }

  const handleClickPrev = () => {
    setSkip(skip > 0 ? skip - 10 : 0)
    setPage(page > 1 ? page - 1 : 1)
  }

  const handleClickNext = () => {
    setSkip(skip + 10)
    setPage(page + 1)
  }

  useEffect(() => {
    if (isSuccessListReport && dataListReport && dataListReport.data) {
      setTableData(
        dataListReport.data.items.map((report) => [
          <div
            key={`name-${report._id}`}
            className='min-w-[200px] w-full'
          >
            <p
              title={report.name}
              className='break-all line-clamp-2'
            >
              {report.name}
            </p>
          </div>,
          report.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
          <p
            key={`total-price-${report._id}`}
            className='w-[120px]'
          >
            {formatToRupiah(report.totalPrice)}
          </p>,
          <div
            key={`actions-${report._id}`}
            className='flex items-center space-x-2'
          >
            {report.booking === null ? (
              <>
                <Link
                  href={`/cms/reports/${report._id}/edit`}
                  className='w-fit flex items-center space-x-2 rounded-md bg-orange-500 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  <PencilIcon className='size-3' />

                  <span>Edit</span>
                </Link>

                <button
                  className='w-fit flex items-center space-x-2 rounded-md bg-red-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
                  onClick={handleClickOpenDeleteModal(report)}
                >
                  <TrashIcon className='size-3' />

                  <span>Hapus</span>
                </button>
              </>
            ) : (
              '-'
            )}
          </div>,
        ])
      )
    }
  }, [isSuccessListReport, dataListReport])

  return (
    <>
      <CMSLayout pages={breadcrumbsPages}>
        <Table
          title='List Laporan'
          description='list manajemen laporan'
          addButton={{
            path: '/cms/reports/create',
          }}
          headers={tableHeaders}
          data={tableData}
          totalData={dataListReport?.data.metadata.count ?? 0}
          currentPage={page}
          handleClickPrev={handleClickPrev}
          handleClickNext={handleClickNext}
        />
      </CMSLayout>

      <DeleteModal
        text={selectedReport?.name ?? ''}
        isOpen={isOpenDeleteModal}
        closeModal={handleCloseDeleteModal}
        disabled={isPendingDeleteReport || isSuccessDeleteReport}
        action={handleClickDelete}
      />
    </>
  )
}
