'use client'
import { FC, useState } from 'react'
import Modal from '@/components/Modal'
import DatePicker from '@/components/DatePicker'
import TimeDropdown from '@/components/TimeDropdown'
import { DropdownOption } from '@/components/cms/Dropdown'
import FormInput from '@/components/cms/FormInput'
import { useForm } from 'react-hook-form'

type FieldOrderRequest = {
  name: string
  email: string
  phoneNumber: string
  startTime: string
  endTime: string
}

type FieldOrderModalProps = {
  fieldName: string
  isOpen: boolean
  closeModal: () => void
}

const FieldOrderModal: FC<FieldOrderModalProps> = ({ fieldName, isOpen, closeModal }) => {
  const [selectedDate, setSelectedDate] = useState('')

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<FieldOrderRequest>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      startTime: '',
      endTime: '',
    },
  })

  const handleClickTimeDropdown = (option: DropdownOption[]) => {
    console.log(option)
  }

  const handleChangeDate = (date: string) => {
    setSelectedDate(date)
  }

  const onSubmit = (data: FieldOrderRequest) => {
    console.log(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className='w-[calc(100vw-32px)] lg:max-w-[584px] p-5 lg:p-10'
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
            wrapperClassName='w-full'
          />
        </div>

        <div className='flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-4 w-full'>
          <FormInput
            control={control}
            id='email'
            name='email'
            type='email'
            label='Email'
            placeholder='Ketikan email anda'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'Email wajib diisi!',
              },
            }}
            errors={errors}
            wrapperClassName='w-full'
          />

          <FormInput
            control={control}
            id='phoneNumber'
            name='phoneNumber'
            type='text'
            label='No. Telpon'
            placeholder='Ketikan nomor telepon anda'
            register={register}
            rules={{
              required: {
                value: true,
                message: 'Nomor telepon wajib diisi!',
              },
            }}
            errors={errors}
            wrapperClassName='w-full'
          />
        </div>

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

        <div className='w-full flex items-center space-x-2'>
          <button
            type='button'
            className='w-full text-blue-700 bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-solid border-blue-700 hover:border-blue-700/70 hover:text-blue-700/70'
            onClick={closeModal}
          >
            Add to cart
          </button>

          <button
            type='submit'
            className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
            onClick={closeModal}
          >
            Checkout
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FieldOrderModal
