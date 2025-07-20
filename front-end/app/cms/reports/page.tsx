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
import { DropdownOption } from '@/components/cms/Dropdown'
import { format } from 'date-fns'

export default function Reports() {
  const queryClient = useQueryClient()

  const [tableData, setTableData] = useState<(string | ReactNode)[][]>([])
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const queryParamsDefaultValue = {
    skip: 0,
    page: 1,
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'desc',
  }
  const [queryParams, setQueryParams] = useState(queryParamsDefaultValue)

  const sortByDefaultValue = [
    {
      xid: 'desc',
      value: 'Terbaru',
      selected: true,
    },
    {
      xid: 'asc',
      value: 'Terlama',
      selected: false,
    },
  ]
  const [sortByOptions, setSortByOptions] = useState<DropdownOption[]>(sortByDefaultValue)

  const {
    data: dataListReport,
    isSuccess: isSuccessListReport,
    isPending: isPendingListReport,
  } = useQuery<ListReportRequest, unknown, ListReportResponse>({
    queryKey: ['report', queryParams],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const params = {
        skip: String(queryParams.skip),
        sortBy: queryParams.sortBy,
        search: queryParams.search,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      }
      const queryString = new URLSearchParams(params).toString()

      const res = await fetchWithAuth('cms', `${ENV.API_URL}/reports?${queryString}`)

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
  const tableHeaders = ['Nama', 'Dibuat Pada', 'Jenis', 'Jumlah', 'Action']

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
    setQueryParams((prev) => ({
      ...prev,
      page: prev.page > 1 ? prev.page - 1 : 1,
      skip: prev.skip > 0 ? prev.skip - 10 : 0,
    }))
  }

  const handleClickNext = () => {
    setQueryParams((prev) => ({
      ...prev,
      page: prev.page + 1,
      skip: prev.skip + 10,
    }))
  }

  const handleChangeSearch = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      search: value,
      page: 1,
      skip: 0,
    }))
  }

  const handleChangeSortBy = (newSelectedOption: DropdownOption) => {
    const newOptions = sortByOptions.map((option) => ({ ...option, selected: false }))
    const selectedIndex = newOptions.findIndex((option) => option.xid === newSelectedOption.xid)

    if (selectedIndex !== -1) {
      newOptions.splice(selectedIndex, 1, { ...newSelectedOption, selected: true })

      setSortByOptions(newOptions)

      setQueryParams((prev) => ({
        ...prev,
        sortBy: newSelectedOption.xid,
        page: 1,
        skip: 0,
      }))
    }
  }

  const handleChangeStartDate = (date: string) => {
    setQueryParams((prev) => ({
      ...prev,
      startDate: date,
      page: 1,
      skip: 0,
    }))
  }

  const handleChangeEndDate = (date: string) => {
    setQueryParams((prev) => ({
      ...prev,
      endDate: date,
      page: 1,
      skip: 0,
    }))
  }

  const handleClickReset = () => {
    setQueryParams(queryParamsDefaultValue)
    setSortByOptions(sortByDefaultValue)
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
          format(report.createdAt as unknown as Date, 'dd/MM/yyyy HH:mm'),
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
          currentPage={queryParams.page}
          handleClickPrev={handleClickPrev}
          handleClickNext={handleClickNext}
          filters={{
            handleChangeSearch,
            sortByOptions,
            handleChangeSortBy,
            handleClickReset,
            showDatePickers: true,
            startDate: {
              value: queryParams.startDate,
              onChange: handleChangeStartDate,
            },
            endDate: {
              value: queryParams.endDate,
              onChange: handleChangeEndDate,
            },
            disabledReset: isPendingListReport,
          }}
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
