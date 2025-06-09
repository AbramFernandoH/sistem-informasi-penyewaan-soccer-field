'use client'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import Dropdown, { DropdownOption } from '@/components/cms/Dropdown'
import { useState } from 'react'

type CreateReportRequest = {
  name: string
  type: 'Pemasukan' | 'Pengeluaran'
  price: string
}

export default function CreateReport() {
  const [openReportTypeDropdown, setOpenReportTypeDropdown] = useState(false)
  const [reportTypeOptions, setReportTypeOptions] = useState<DropdownOption[]>([
    {
      xid: '1',
      value: 'Pemasukan',
      selected: true,
    },
    {
      xid: '2',
      value: 'Pengeluaran',
      selected: false,
    },
  ])

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<CreateReportRequest>({
    defaultValues: {
      name: '',
      type: 'Pemasukan',
      price: '',
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Laporan', path: '/cms/reports', current: false },
    { name: 'Tambah Laporan', path: '/cms/reports/create', current: true },
  ]

  const handleChangeSelectedField = (newSelectedOption: DropdownOption) => () => {
    const newOptions = reportTypeOptions.map((option) => ({ ...option, selected: false }))
    const selectedIndex = newOptions.findIndex((option) => option.xid === newSelectedOption.xid)

    if (selectedIndex !== -1) {
      newOptions.splice(selectedIndex, 1, { ...newSelectedOption, selected: true })

      setReportTypeOptions(newOptions)
    }

    setOpenReportTypeDropdown(false)
  }

  const onSubmit = (data: CreateReportRequest) => {
    console.log(data)
  }

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Tambah Laporan'
        backUrl='/cms/reports'
      />

      <form
        className='flex flex-col items-center space-y-6 mt-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput
          control={control}
          id='name'
          name='name'
          type='text'
          label='Nama Laporan'
          placeholder='Ketikan nama laporan. misal Maintenance rumput'
          register={register}
          rules={{
            required: {
              value: true,
              message: 'Nama laporan wajib diisi!',
            },
          }}
          errors={errors}
          wrapperClassName='w-full'
        />

        <div className='flex flex-col space-y-2 w-full'>
          <FormLabel
            label='Tipe Laporan'
            name='report-type'
          />

          <Dropdown
            isOpen={openReportTypeDropdown}
            setIsOpen={setOpenReportTypeDropdown}
            options={reportTypeOptions}
            handleClickOption={handleChangeSelectedField}
          />
        </div>

        <FormInput
          control={control}
          id='price'
          name='price'
          type='text'
          label='Jumlah'
          placeholder='Ketik jumlah pemasukan atau pengeluaran'
          register={register}
          rules={{
            required: {
              value: true,
              message: 'Jumlah wajib diisi!',
            },
          }}
          errors={errors}
          wrapperClassName='w-full'
        />

        <button
          type='submit'
          className='w-fit rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
