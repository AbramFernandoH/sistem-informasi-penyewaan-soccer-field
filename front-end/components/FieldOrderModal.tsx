'use client'
import { useState } from 'react'
import Datepicker from 'tailwind-datepicker-react'

// TODO: handle click outside to close this modal
const FieldOrderModal = () => {
  const [show, setShow] = useState(false)
  const handleChange = (selectedDate: Date) => {
    console.log(selectedDate)
  }
  const options = {
    title: 'Tanggal Pemesanan',
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    clearBtnText: 'Hapus',
    minDate: new Date(),
    theme: {
      background: 'bg-gray-700 dark:bg-gray-800',
      todayBtn: '',
      clearBtn: '',
      icons: '',
      text: '',
      disabledText: 'bg-red-500',
      input: '',
      inputIcon: '',
      selected: '',
    },
    icons: {
      // () => ReactElement | JSX.Element
      prev: () => <span>Previous</span>,
      next: () => <span>Next</span>,
    },
    datepickerClassNames: 'top-12',
    defaultDate: new Date(),
    language: 'en',
    disabledDates: [],
    weekDays: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    inputNameProp: 'date',
    inputIdProp: 'date-picker',
    inputPlaceholderProp: 'Pilih tanggal pemesanan',
    inputDateFormatProp: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  }
  const handleCloseDatePicker = (state: boolean) => {
    setShow(state)
  }

  return (
    <div
      id='field-modal'
      tabIndex={-1}
      className='hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full bg-black/30'
    >
      <div className='relative p-4 w-full max-w-md max-h-full'>
        <div className='relative bg-white rounded-lg shadow-sm dark:bg-gray-700'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>Form Pemesanan</h3>
            <button
              type='button'
              className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
              data-modal-hide='field-modal'
            >
              <svg
                className='w-3 h-3'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 14'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                />
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>

          <div className='p-4 md:p-5'>
            <form
              className='space-y-4'
              action='#'
            >
              <div>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Email
                </label>

                <input
                  type='email'
                  id='email'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='example@gmail.com'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  No. Telp
                </label>

                {/* TODO: change the pattern later on */}
                <input
                  type='tel'
                  id='phone'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='123-45-678'
                  pattern='[0-9]{3}-[0-9]{2}-[0-9]{3}'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='date-picker'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Tanggal pemesanan
                </label>

                {/* TODO: add logic to make this input required */}
                <Datepicker
                  id='date-picker'
                  options={options}
                  onChange={handleChange}
                  show={show}
                  setShow={handleCloseDatePicker}
                />
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='message'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Catatan (Opsional)
                </label>
                <textarea
                  id='message'
                  rows={4}
                  className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Catatan'
                ></textarea>
              </div>

              <div className='w-full flex items-center space-x-2'>
                <button
                  type='submit'
                  className='w-full text-blue-700 bg-white hover:bg-white/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                >
                  Add to cart
                </button>

                <button
                  type='submit'
                  className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FieldOrderModal
