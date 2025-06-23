'use client'
import { FC, useEffect, useMemo, useState } from 'react'
import Modal from '@/components/Modal'
import DatePicker from '@/components/DatePicker'
import TimeDropdown from '@/components/TimeDropdown'
import Dropdown, { DropdownOption } from '@/components/cms/Dropdown'
import FormInput from '@/components/cms/FormInput'
import { useForm } from 'react-hook-form'
import { userProfileStore } from '@/stores/userProfile'
import {
  BaseResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  CreateCartRequest,
  DetailCartResponse,
  ListScheduleRequest,
  ListScheduleResponse,
} from '@/utils/type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { allowOnlyNumbers, fetchWithAuth, isThreeDaysOrMoreInFuture, isTimeSlotExpired } from '@/utils/helper'
import { ENV } from '@/utils/constants'
import { isToday } from 'date-fns'
import toast from 'react-hot-toast'
import FormLabel from '@/components/cms/FormLabel'
import { cartStore } from '@/stores/cart'

const isUpfrontDisabledOptions = [
  {
    xid: 'false',
    value: 'Lunas',
    selected: true,
    disabled: false,
  },
  {
    xid: 'true',
    value: 'DP 50%',
    selected: false,
    disabled: true,
  },
]

const isUpfrontDefaultOptions = [
  {
    xid: 'false',
    value: 'Lunas',
    selected: true,
    disabled: false,
  },
  {
    xid: 'true',
    value: 'DP 50%',
    selected: false,
    disabled: false,
  },
]

type FieldOrderModalProps = {
  fieldId: string
  fieldName: string
  fieldPrice: number
  isOpen: boolean
  closeModal: () => void
}

const FieldOrderModal: FC<FieldOrderModalProps> = ({ fieldId, fieldName, fieldPrice, isOpen, closeModal }) => {
  const queryClient = useQueryClient()

  const user = userProfileStore((state) => state.user)
  const { addCartItem } = cartStore((state) => state)

  const [timeOptions, setTimeOptions] = useState<DropdownOption[]>([])
  const [resetTime, setResetTime] = useState(false)
  const [isOpenUpfrontDropdown, setIsOpenUpfrontDropdown] = useState(false)
  const [isUpfrontOptions, setIsUpfrontOptions] = useState<DropdownOption[]>(isUpfrontDefaultOptions)

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    clearErrors,
    getValues,
    reset: resetForm,
    formState: { errors },
  } = useForm<CreateBookingRequest>({
    defaultValues: {
      name: '',
      email: '',
      telephoneNumber: '',
      field: '',
      orderDate: '',
      timeSlots: [0],
    },
  })
  const orderDate = watch('orderDate')

  const { data: dataListSchedule, isSuccess: isSuccessListSchedule } = useQuery<
    ListScheduleRequest,
    unknown,
    ListScheduleResponse
  >({
    queryKey: ['schedule', orderDate, fieldId],
    refetchOnWindowFocus: false,
    enabled: orderDate.length > 0 && fieldId.length > 0,
    queryFn: async () => {
      const res = await fetch(`${ENV.API_URL}/schedules/public?date=${orderDate}&fieldId=${fieldId}`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list schedule')
      }

      return res.json()
    },
  })

  const {
    isPending: isPendingCreateBooking,
    isSuccess: isSuccessCreateBooking,
    reset: resetCreateBooking,
    mutate: mutateCreateBooking,
  } = useMutation<CreateBookingResponse, unknown, CreateBookingRequest>({
    mutationFn: async (data) => {
      let response

      if (user === null) {
        response = await fetch(`${ENV.API_URL}/bookings/add-guest-transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      } else {
        response = await fetchWithAuth('pwa', `${ENV.API_URL}/bookings/add-registered-first-transaction`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      }

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Failed to add booking')
      }

      return json
    },
    onSuccess: async (response) => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['booking'] })

      toast.success('Booking lapangan berhasil')

      resetCreateBooking()

      window.open(response.data.redirect_url, '_blank')

      setIsUpfrontOptions(isUpfrontDefaultOptions)

      resetForm()

      closeModal()
    },
    onError: () => {
      toast.error('Gagal membuat booking lapangan')
    },
  })

  const {
    isPending: isPendingAddCart,
    isSuccess: isSuccessAddCart,
    mutate: mutateAddCart,
  } = useMutation<DetailCartResponse, BaseResponse, CreateCartRequest>({
    mutationFn: async (data) => {
      const response = await fetchWithAuth('pwa', `${ENV.API_URL}/carts/add`, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const json = await response.json()

      if (!response.ok) {
        // Attach the JSON error message if needed
        throw new Error(json.message || 'Failed to add item to cart')
      }

      return json
    },
    onSuccess: async (response) => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['cart'] })

      toast.success('Berhasil menambahkan item ke keranjang')

      addCartItem(response.data)

      setIsUpfrontOptions(isUpfrontDefaultOptions)

      resetForm()

      closeModal()
    },
    onError: (err) => {
      closeModal()

      if (err.message === 'Cart item already exists') {
        toast.error('Item sudah ada di keranjang, pilih jadwal atau lapangan lain', { duration: 6000 })
      } else {
        toast.error('Gagal menambahkan item ke keranjang')
      }
    },
  })

  const isDisabled = useMemo(
    () => isPendingCreateBooking || isSuccessCreateBooking || isPendingAddCart || isSuccessAddCart,
    [isPendingCreateBooking, isSuccessCreateBooking, isPendingAddCart, isSuccessAddCart]
  )

  const isAllFilled = useMemo(() => {
    const name = getValues('name')
    const email = getValues('email')
    const telephoneNumber = getValues('telephoneNumber')

    return [name, email, telephoneNumber, orderDate].every((value) => value.length > 0)
  }, [getValues, orderDate])

  const handleCloseModal = () => {
    if (!isPendingCreateBooking && !isSuccessCreateBooking && !isPendingAddCart && !isSuccessAddCart) {
      closeModal()
    }
  }

  const handleChangeSelectedUpfront = (newSelectedOption: DropdownOption) => {
    const newOptions = isUpfrontOptions.map((option) => ({ ...option, selected: false }))
    const selectedIndex = newOptions.findIndex((option) => option.xid === newSelectedOption.xid)

    if (selectedIndex !== -1) {
      newOptions.splice(selectedIndex, 1, { ...newSelectedOption, selected: true })

      setIsUpfrontOptions(newOptions)

      setValue('isUpfront', newSelectedOption.xid === 'true')
    }

    setIsOpenUpfrontDropdown(false)
  }

  const handleClickTimeDropdown = (option: DropdownOption[]) => {
    clearErrors('timeSlots')

    setValue(
      'timeSlots',
      option.map((opt) => Number(String(opt.xid).slice(-2).replace('-', '')))
    )
  }

  const handleChangeDate = (date: string) => {
    clearErrors('orderDate')
    setValue('timeSlots', [0])
    setResetTime(!resetTime)

    if (!isThreeDaysOrMoreInFuture(date)) {
      setIsUpfrontOptions(isUpfrontDisabledOptions)

      setValue('isUpfront', false)
    } else {
      setIsUpfrontOptions(isUpfrontDefaultOptions)
    }

    setValue('orderDate', date)
  }

  const handleClickAddToCart = () => {
    if (user !== null) {
      const timeSlots = getValues('timeSlots')

      mutateAddCart({
        user: user._id,
        field: fieldId,
        orderDate,
        timeSlots,
        name: user.fullName,
        email: user.email,
        telephoneNumber: user.telephoneNumber,
        price: fieldPrice * timeSlots.length,
      })
    }
  }

  const onSubmit = (data: CreateBookingRequest) => {
    const payload = {
      ...data,
      field: fieldId,
    }

    if (user !== null) {
      payload.user = user._id
    }

    mutateCreateBooking(payload)
  }

  useEffect(() => {
    if (isSuccessListSchedule && dataListSchedule) {
      const isSelectedDateToday = isToday(new Date(orderDate))
      const existsTimeSlots = dataListSchedule.data.items.flatMap((opt) => opt.timeSlots)
      const selectedValue = Array.from({ length: 15 })
        .map((_, idx) => idx)
        .filter((val) =>
          isSelectedDateToday
            ? !existsTimeSlots.includes(val) && !isTimeSlotExpired(val, orderDate)
            : !existsTimeSlots.includes(val)
        )

      const options = Array.from({ length: 15 }).map((_, idx) => ({
        xid: `${fieldId}-${orderDate}-${idx}`,
        value: `${7 + idx < 10 ? '0' : ''}${7 + idx}:00 - ${8 + idx < 10 ? '0' : ''}${8 + idx}:00`,
        selected: selectedValue.length > 0 ? idx === selectedValue[0] : false,
        disabled: existsTimeSlots.includes(idx) || (isSelectedDateToday && isTimeSlotExpired(idx, orderDate)),
      }))

      setTimeOptions(options)
    }
  }, [isSuccessListSchedule, dataListSchedule, fieldId, orderDate])

  useEffect(() => {
    if (user !== null && isOpen) {
      setValue('name', user.fullName)
      setValue('email', user.email)
      setValue('telephoneNumber', user.telephoneNumber)
    }
  }, [setValue, user, isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className='!w-[calc(100vw-32px)] sm:max-w-[600px] lg:max-w-[584px] p-5 lg:p-10'
    >
      <h4 className='mb-6 text-lg font-medium text-gray-800 w-[calc(100%-30px)] lg:w-full'>
        Form Pemesanan {fieldName}
      </h4>

      <form
        className='flex flex-col items-center space-y-6 mt-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <FormInput
            control={control}
            id='name'
            name='name'
            type='text'
            label='Nama'
            placeholder='Ketikan atas nama pemesanan lapangan'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'Atas nama pemesanan lapangan wajib diisi!',
              },
            }}
            errors={errors}
            disabled={user !== null}
            wrapperClassName='w-full'
          />
        </div>

        <div className='flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <FormInput
            control={control}
            id='email'
            name='email'
            type='text'
            label='Email'
            placeholder='Ketikan email anda'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'Email wajib diisi!',
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email tidak valid!',
              },
            }}
            errors={errors}
            disabled={user !== null}
            wrapperClassName='w-full'
          />

          <FormInput
            control={control}
            id='phoneNumber'
            name='telephoneNumber'
            type='text'
            label='No. Handphone'
            placeholder='Ketikan nomor telepon anda'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'No. Handphone wajib diisi!',
              },
              minLength: {
                message: 'No. Handphone minimal 8 digit!',
                value: 8,
              },
              maxLength: {
                message: 'No. Handphone maksimal 14 digit!',
                value: 14,
              },
              pattern: {
                value: /^(628|08)\d*$/,
                message: 'No. Handphone harus di awali angka 628 atau 08',
              },
            }}
            maxLength={15}
            errors={errors}
            onKeyDown={allowOnlyNumbers}
            disabled={user !== null}
            wrapperClassName='w-full'
          />
        </div>

        <div className='flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <div className='flex flex-col space-y-2 w-full lg:w-1/2'>
            <DatePicker
              label='Tanggal'
              name='orderDate'
              value={orderDate}
              className='w-full'
              min={new Date().toISOString().split('T')[0]}
              onChange={handleChangeDate}
            />

            {errors && errors.orderDate && errors.orderDate.message && (
              <p className='text-xs font-medium leading-[16px] text-red-500'>{errors.orderDate.message}</p>
            )}

            <input
              {...register('orderDate', {
                required: {
                  value: true,
                  message: 'Tanggal wajib dipilih!',
                },
              })}
              className='hidden'
            />
          </div>

          <div className='flex flex-col space-y-2 w-full lg:w-1/2'>
            <TimeDropdown
              setSelectedTime={handleClickTimeDropdown}
              disabled={orderDate.length === 0}
              resetSignal={resetTime}
              options={timeOptions}
              isMultiSelect={false}
            />

            {errors && errors.timeSlots && errors.timeSlots.message && (
              <p className='text-xs font-medium leading-[16px] text-red-500'>{errors.timeSlots.message}</p>
            )}

            <input
              {...register('timeSlots', {
                required: {
                  value: true,
                  message: 'Waktu wajib dipilih!',
                },
              })}
              className='hidden'
            />
          </div>
        </div>

        {user !== null && (
          <div className='flex flex-col space-y-2 w-full'>
            <FormLabel
              label='Pilihan DP / Lunas'
              name='isUpfront'
            />

            <Dropdown
              isOpen={isOpenUpfrontDropdown}
              setIsOpen={setIsOpenUpfrontDropdown}
              options={isUpfrontOptions}
              handleClickOption={handleChangeSelectedUpfront}
              disabled={orderDate.length == 0}
            />
          </div>
        )}

        <div className='w-full flex items-center space-x-2'>
          {user !== null && (
            <button
              type='button'
              className='w-full text-blue-700 bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-solid border-blue-700 hover:border-blue-700/70 hover:text-blue-700/70 disabled:border-0 disabled:text-white disabled:bg-gray-200 disabled:hover:cursor-not-allowed'
              onClick={handleClickAddToCart}
              disabled={isDisabled || !isAllFilled}
            >
              Tambah ke keranjang
            </button>
          )}

          <button
            type='submit'
            className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-200 disabled:hover:cursor-not-allowed'
            disabled={isDisabled}
          >
            Checkout
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FieldOrderModal
