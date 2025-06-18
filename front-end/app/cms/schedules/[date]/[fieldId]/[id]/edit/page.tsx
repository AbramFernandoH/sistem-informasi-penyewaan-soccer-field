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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateEditScheduleRequest,
  DetailScheduleResponse,
  ListFieldRequest,
  ListFieldResponse,
  ListScheduleRequest,
  ListScheduleResponse,
} from '@/utils/type'
import { fetchWithAuth, isSequential, isTimeSlotExpired } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import toast from 'react-hot-toast'
import { useRouter, useParams } from 'next/navigation'
import { format, startOfToday, parseISO } from 'date-fns'
import { id as indonesianLocale } from 'date-fns/locale/id'

export default function EditSchedule() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [fieldName, setFieldName] = useState(String(params.fieldId))
  const [openFieldDropdown, setOpenFieldDropdown] = useState(false)
  const [fieldOptions, setFieldOptions] = useState<DropdownOption[]>([])
  const [timeOptions, setTimeOptions] = useState<DropdownOption[]>([])
  const [resetTime, setResetTime] = useState(false)

  const breadcrumbsPages: BreadcrumbData[] = [
    { name: 'List Jadwal', path: '/cms/schedules', current: false },
    {
      name: format(String(params.date), 'd MMMM yyyy', { locale: indonesianLocale }),
      path: `/cms/schedules/${String(params.date)}`,
      current: false,
    },
    {
      name: fieldName,
      path: `/cms/schedules/${String(params.date)}/${String(params.fieldId)}`,
      current: false,
    },
    {
      name: 'Ubah Jadwal',
      path: `/cms/schedules/${String(params.date)}/${String(params.fieldId)}/${String(params.scheduleId)}/edit`,
      current: true,
    },
  ]

  const {
    handleSubmit,
    control,
    register,
    setValue,
    setError,
    clearErrors,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateEditScheduleRequest>({
    defaultValues: {
      field: '',
      reason: '',
      date: '',
      timeSlots: [0],
    },
  })
  const [date, field] = watch(['date', 'field'])

  const { data: dataDetailSchedule, isSuccess: isSuccessDetailSchedule } = useQuery<
    unknown,
    unknown,
    DetailScheduleResponse
  >({
    queryKey: ['field', params.id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/schedules/${params.id}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get detail schedule')
      }

      return res.json()
    },
  })

  const { data: dataListField, isSuccess: isSuccessListField } = useQuery<ListFieldRequest, unknown, ListFieldResponse>(
    {
      queryKey: ['field'],
      refetchOnWindowFocus: false,
      queryFn: async () => {
        const res = await fetchWithAuth('cms', `${ENV.API_URL}/fields`)

        if (!res.ok) {
          const errorData = await res.json()

          throw new Error(errorData.message || 'Failed to get list field')
        }

        return res.json()
      },
    }
  )

  const { data: dataListSchedule, isSuccess: isSuccessListSchedule } = useQuery<
    ListScheduleRequest,
    unknown,
    ListScheduleResponse
  >({
    queryKey: ['schedule', date, field],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetchWithAuth('cms', `${ENV.API_URL}/schedules?date=${date}&fieldId=${field}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list schedule')
      }

      return res.json()
    },
  })

  const {
    isPending: isPendingEditSchedule,
    isSuccess: isSuccessEditSchedule,
    mutate: editSchedule,
  } = useMutation<DetailScheduleResponse, unknown, CreateEditScheduleRequest>({
    mutationFn: async (data) => {
      const response = await fetchWithAuth('cms', `${ENV.API_URL}/schedules/${params.id}/edit`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Edit schedule failed')
      }

      return json
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['schedule'] })

      toast.success('Jadwal berhasil diubah')

      router.push(breadcrumbsPages[2].path)
    },
    onError: () => {
      toast.error('Gagal mengubah jadwal')
    },
  })

  const handleChangeSelectedField = (newSelectedOption: DropdownOption) => {
    const newOptions = fieldOptions.map((option) => ({ ...option, selected: false }))
    const selectedIndex = newOptions.findIndex((option) => option.xid === newSelectedOption.xid)

    setValue('date', '')
    setValue('timeSlots', [0])
    setResetTime(!resetTime)

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
      option.map((opt) => Number(String(opt.xid).slice(-2).replace('-', '')))
    )
  }

  const handleChangeDate = (date: string) => {
    clearErrors('date')
    setValue('timeSlots', [0])
    setResetTime(!resetTime)

    setValue('date', date)
  }

  const checkCreateSchedule = () => {
    const date = getValues('date')
    const timeSlots = getValues('timeSlots')
    const reason = getValues('reason')

    if (date.length === 0 || timeSlots.length === 0 || reason.length === 0 || !isSequential(timeSlots)) {
      if (date.length === 0) {
        setError('date', { message: 'Tanggal wajib diisi!' })
      }

      if (timeSlots.length === 0) {
        setError('timeSlots', { message: 'Waktu wajib diisi!' })
      } else if (!isSequential(timeSlots)) {
        setError('timeSlots', { message: 'Waktu yang diisi harus berurutan!' })
      }

      if (reason.length === 0) {
        setError('reason', { message: 'Alasan wajib diisi!' })
      }
    } else {
      handleSubmit(onSubmit)()
    }
  }

  const onSubmit = (data: CreateEditScheduleRequest) => {
    editSchedule(data)
  }

  useEffect(() => {
    if (isSuccessListField && dataListField && dataListField.data && dataListField.data.items !== undefined) {
      const options = dataListField.data.items.map((item, idx) => ({
        xid: item._id,
        value: item.name,
        selected: params ? params.fieldId === item._id : idx === 0,
      }))

      setFieldOptions(options)
    }
  }, [isSuccessListField, dataListField])

  useEffect(() => {
    if (isSuccessListSchedule && dataListSchedule && dataListSchedule.data.items !== undefined) {
      const defaultValue = {
        date: String(params.date),
        timeSlots: dataDetailSchedule && dataDetailSchedule.data ? dataDetailSchedule.data.timeSlots : [],
      }

      const existsTimeSlots = dataListSchedule.data.items.flatMap((opt) => opt.timeSlots)

      if (defaultValue.timeSlots.length > 0 && date === defaultValue.date) {
        const filteredExistsTimeSlots = existsTimeSlots.filter((val) => !defaultValue.timeSlots.includes(val))

        const options = Array.from({ length: 15 }).map((_, idx) => ({
          xid: `${field}-${date}-${idx}`,
          value: `${7 + idx < 10 ? '0' : ''}${7 + idx}:00 - ${8 + idx < 10 ? '0' : ''}${8 + idx}:00`,
          selected: defaultValue.timeSlots.includes(idx),
          disabled: filteredExistsTimeSlots.includes(idx) || isTimeSlotExpired(idx, date),
        }))

        setTimeOptions(options)
      } else {
        const selectedValue = Array.from({ length: 15 })
          .map((_, idx) => idx)
          .filter((val) => !existsTimeSlots.includes(val))

        const options = Array.from({ length: 15 }).map((_, idx) => ({
          xid: `${field}-${date}-${idx}`,
          value: `${7 + idx < 10 ? '0' : ''}${7 + idx}:00 - ${8 + idx < 10 ? '0' : ''}${8 + idx}:00`,
          selected: selectedValue.length > 0 ? idx === selectedValue[0] : false,
          disabled: existsTimeSlots.includes(idx),
        }))

        setTimeOptions(options)
      }
    }
  }, [isSuccessListSchedule, dataListSchedule, isSuccessDetailSchedule, dataDetailSchedule, date])

  useEffect(() => {
    if (isSuccessDetailSchedule && dataDetailSchedule && dataDetailSchedule.data) {
      const detailDateEpoch = parseISO(dataDetailSchedule.data.date).getTime()
      const detailDateFormated = format(new Date(dataDetailSchedule.data.date), 'yyyy-MM-dd')
      const todayDateEpoch = startOfToday().getTime()
      const lastTimeSlots = dataDetailSchedule.data.timeSlots[dataDetailSchedule.data.timeSlots.length - 1]

      if (
        detailDateEpoch < todayDateEpoch ||
        (detailDateFormated === String(params.date) && isTimeSlotExpired(lastTimeSlots, String(params.date)))
      ) {
        toast('Tidak bisa mengubah jadwal yang sudah lewat', {
          duration: 6000,
        })

        router.push(breadcrumbsPages[2].path)
      } else {
        setFieldName(dataDetailSchedule.data.field.name)

        reset({
          field: dataDetailSchedule.data.field._id,
          date: detailDateFormated,
          reason: dataDetailSchedule.data.reason,
          timeSlots: dataDetailSchedule.data.timeSlots,
        })
      }
    }
  }, [isSuccessDetailSchedule, dataDetailSchedule])

  return (
    <CMSLayout pages={breadcrumbsPages}>
      <Header
        title='Ubah Jadwal'
        backUrl={breadcrumbsPages[2].path}
      />

      <form className='flex flex-col items-center space-y-6 mt-4 w-full'>
        <div className='flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
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
        </div>

        <div className='flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <div className='flex flex-col space-y-2 w-full lg:w-1/2'>
            <DatePicker
              label='Tanggal'
              name='schedule-date'
              value={date}
              className='w-full'
              min={new Date().toISOString().split('T')[0]}
              onChange={handleChangeDate}
              disabled={field.length === 0}
            />

            {errors && errors.date && errors.date.message && (
              <p className='text-xs font-medium leading-[16px] text-red-500'>{errors.date.message}</p>
            )}
          </div>

          <div className='flex flex-col space-y-2 w-full lg:w-1/2'>
            <TimeDropdown
              setSelectedTime={handleClickTimeDropdown}
              disabled={date.length === 0 || field.length === 0}
              resetSignal={resetTime}
              options={timeOptions}
            />

            {errors && errors.timeSlots && errors.timeSlots.message && (
              <p className='text-xs font-medium leading-[16px] text-red-500'>{errors.timeSlots.message}</p>
            )}
          </div>
        </div>

        <button
          type='button'
          className='flex items-center space-x-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
          disabled={isPendingEditSchedule || isSuccessEditSchedule}
          onClick={checkCreateSchedule}
        >
          Submit
        </button>
      </form>
    </CMSLayout>
  )
}
