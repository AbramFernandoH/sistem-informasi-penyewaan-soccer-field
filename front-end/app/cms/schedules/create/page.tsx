'use client'
import { useEffect, useState } from 'react'
import CMSLayout from '@/layouts/cms'
import { BreadcrumbData } from '@/components/cms/Breadcrumbs'
import Header from '@/components/cms/Header'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import Dropdown, { DropdownOption } from '@/components/cms/Dropdown'
import DatePicker from '@/components/DatePicker'
import TimeDropdown from '@/components/TimeDropdown'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CreateScheduleRequest, CreateScheduleResponse, ListFieldRequest, ListFieldResponse } from '@/utils/type'
import { fetchWithAuth } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function CreateSchedule() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState('')
  const [openFieldDropdown, setOpenFieldDropdown] = useState(false)
  const [fieldOptions, setFieldOptions] = useState<DropdownOption[]>([])

  const {
    handleSubmit,
    control,
    register,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<CreateScheduleRequest>({
    defaultValues: {
      field: '',
      reason: '',
      date: '',
      timeSlots: [0],
    },
  })

  const { data: dataListField, isSuccess: isSuccessListField } = useQuery<ListFieldRequest, unknown, ListFieldResponse>(
    {
      queryKey: ['schedule'],
      queryFn: async () => {
        const res = await fetchWithAuth('cms', `${ENV.API_URL}/fields`)

        if (!res.ok) {
          const errorData = await res.json()

          throw new Error(errorData.message || 'Failed to fetch profile')
        }

        return res.json()
      },
    }
  )

  const {
    isPending: isPendingCreateSchedule,
    isSuccess: isSuccessCreateSchedule,
    mutate: createSchedule,
  } = useMutation<CreateScheduleResponse, unknown, CreateScheduleRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`${ENV.API_URL}/schedules/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Login failed')
      }

      return json
    },
    onSuccess: () => {
      toast.success('Jadwal berhasil ditambahkan')

      router.push('/cms/schedules')
    },
    onError: () => {
      toast.error('Gagal menambahkan jadwal')
    },
  })

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Jadwal', path: '/cms/schedules', current: false },
    { name: 'Tambah Jadwal', path: '/cms/schedules/create', current: true },
  ]

  const handleChangeSelectedField = (newSelectedOption: DropdownOption) => {
    const newOptions = fieldOptions.map((option) => ({ ...option, selected: false }))
    const selectedIndex = newOptions.findIndex((option) => option.xid === newSelectedOption.xid)

    if (selectedIndex !== -1) {
      const newData = { ...newSelectedOption, selected: true }
      newOptions.splice(selectedIndex, 1, newData)

      setFieldOptions(newOptions)

      setValue('field', newData.xid)
    }

    setOpenFieldDropdown(false)
  }

  const handleClickTimeDropdown = (option: DropdownOption[]) => {
    clearErrors('timeSlots')

    setValue(
      'timeSlots',
      option.map((opt) => Number(opt.xid))
    )
  }

  const handleChangeDate = (date: string) => {
    setSelectedDate(date)

    clearErrors('date')

    setValue('date', date)
  }

  const checkCreateSchedule = () => {
    const date = getValues('date')
    const timeSlots = getValues('timeSlots')
    const reason = getValues('reason')

    if (date.length === 0 || timeSlots.length === 0 || reason.length === 0) {
      if (date.length === 0) {
        setError('date', { message: 'Tanggal wajib diisi!' })
      }

      if (timeSlots.length === 0) {
        setError('timeSlots', { message: 'Waktu wajib diisi!' })
      }

      if (reason.length === 0) {
        setError('reason', { message: 'Alasan wajib diisi!' })
      }
    } else {
      handleSubmit(onSubmit)()
    }
  }

  const onSubmit = (data: CreateScheduleRequest) => {
    createSchedule(data)
  }

  useEffect(() => {
    if (isSuccessListField && dataListField) {
      const options = dataListField.data.items.map((item, idx) => ({
        xid: item._id,
        value: item.name,
        selected: idx === 0,
      }))

      if (getValues('field').length === 0) {
        setValue('field', options[0].xid)
      }

      setFieldOptions(options)
    }
  }, [isSuccessListField, dataListField])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Tambah Jadwal'
        backUrl='/cms/schedules'
      />

      <form className='flex flex-col items-center space-y-6 mt-4 w-full'>
        <div className='flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <div className='flex flex-col space-y-2 w-full'>
            <DatePicker
              label='Tanggal'
              name='schedule-date'
              value={selectedDate}
              className='w-full'
              min={new Date().toISOString().split('T')[0]}
              onChange={handleChangeDate}
            />

            {errors && errors.date && errors.date.message && (
              <p className='text-xs font-medium leading-[16px] text-red-500'>{errors.date.message}</p>
            )}
          </div>

          <div className='flex flex-col space-y-2 w-full'>
            <TimeDropdown setSelectedTime={handleClickTimeDropdown} />

            {errors && errors.timeSlots && errors.timeSlots.message && (
              <p className='text-xs font-medium leading-[16px] text-red-500'>{errors.timeSlots.message}</p>
            )}
          </div>
        </div>

        <div className='flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
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
            register={register}
            errors={errors}
            id='reason'
            name='reason'
            type='text'
            label='Alasan'
            placeholder='Ketikan alasan lapangan ditutup sementara'
            wrapperClassName='w-full'
            className='h-10'
          />
        </div>

        <button
          type='button'
          className='w-fit rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          disabled={isPendingCreateSchedule || isSuccessCreateSchedule}
          onClick={checkCreateSchedule}
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
