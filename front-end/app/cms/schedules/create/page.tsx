'use client'
import { useState } from 'react'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import Dropdown, { DropdownOption } from '@/components/cms/Dropdown'
import DatePicker from '@/components/DatePicker'
import TimeDropdown from '@/components/TimeDropdown'

type CreateScheduleRequest = {
  startTime: number
  endTime: number
  fieldId: string
  reason: string
}

export default function CreateSchedule() {
  const [selectedDate, setSelectedDate] = useState('')
  const [openFieldDropdown, setOpenFieldDropdown] = useState(false)
  const [fieldOptions, setFieldOptions] = useState<DropdownOption[]>([
    {
      xid: 'field-1',
      value: 'Lapangan 1',
      selected: true,
    },
    {
      xid: 'field-2',
      value: 'Lapangan 2',
      selected: false,
    },
    {
      xid: 'field-3',
      value: 'Lapangan 3',
      selected: false,
    },
    {
      xid: 'field-4',
      value: 'Lapangan 4',
      selected: false,
    },
    {
      xid: 'field-5',
      value: 'Lapangan 5',
      selected: false,
    },
  ])

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<CreateScheduleRequest>({
    defaultValues: {
      startTime: 0,
      endTime: 0,
      fieldId: '',
      reason: '',
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Jadwal', path: '/cms/schedules', current: false },
    { name: 'Tambah Jadwal', path: '/cms/schedules/create', current: true },
  ]

  const handleChangeSelectedField = (newSelectedOption: DropdownOption) => () => {
    const newOptions = fieldOptions.map((option) => ({ ...option, selected: false }))
    const selectedIndex = newOptions.findIndex((option) => option.xid === newSelectedOption.xid)

    if (selectedIndex !== -1) {
      newOptions.splice(selectedIndex, 1, { ...newSelectedOption, selected: true })

      setFieldOptions(newOptions)
    }

    setOpenFieldDropdown(false)
  }

  const handleClickTimeDropdown = (option: DropdownOption[]) => {
    console.log(option)
  }

  const handleChangeDate = (date: string) => {
    setSelectedDate(date)
  }

  const onSubmit = (data: CreateScheduleRequest) => {
    console.log(data)
  }

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Tambah Jadwal'
        backUrl='/cms/schedules'
      />

      <form
        className='flex flex-col items-center space-y-6 mt-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <DatePicker
            label='Tanggal'
            name='schedule-date'
            value={selectedDate}
            className='w-full'
            onChange={handleChangeDate}
          />

          <TimeDropdown setSelectedTime={handleClickTimeDropdown} />
        </div>

        <div className='flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <div className='flex flex-col space-y-2 w-full'>
            <FormLabel
              label='Nama Lapangan'
              name='field-name'
            />

            <Dropdown
              isOpen={openFieldDropdown}
              setIsOpen={setOpenFieldDropdown}
              options={fieldOptions}
              handleClickOption={handleChangeSelectedField}
            />
          </div>

          <FormInput
            control={control}
            id='reason'
            name='reason'
            type='text'
            label='Alasan'
            placeholder='Ketikan alasan lapangan ditutup sementara'
            register={register}
            rules={{
              required: true,
            }}
            errors={errors}
            wrapperClassName='w-full'
          />
        </div>

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
