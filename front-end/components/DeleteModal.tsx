'use client'
import { FC } from 'react'
import Modal from '@/components/Modal'
import { TrashIcon } from '@heroicons/react/24/outline'

type FieldOrderModalProps = {
  isOpen: boolean
  text: string
  closeModal: () => void
  action: () => void
  disabled?: boolean
}

const DeleteModal: FC<FieldOrderModalProps> = ({ isOpen, text, closeModal, action, disabled = false }) => {
  const onClose = () => {
    if (!disabled) {
      closeModal()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='!w-[calc(100vw-32px)] sm:max-w-[600px] lg:max-w-[584px] p-5 lg:p-10'
    >
      <div className='text-center'>
        <div className='relative flex items-center justify-center z-[1] mb-7'>
          <div className='rounded-full w-[90px] h-[90px] p-3 flex justify-center items-center bg-red-600'>
            <TrashIcon className='size-12 text-white font-semibold' />
          </div>
        </div>

        <h4 className='mb-2 text-2xl font-semibold text-gray-800 sm:text-title-sm'>Konfirmasi Hapus</h4>

        <p className='text-sm leading-6 text-gray-500'>Apakah anda yakin menghapus {text}?</p>

        <div className='flex items-center justify-center w-full gap-3 mt-7'>
          <button
            type='button'
            className='flex justify-center w-full px-4 py-3 text-sm font-medium rounded-lg bg-white text-red-500 border border-solid border-red-500 shadow-theme-xs hover:bg-error-600 sm:w-auto disabled:border-0 disabled:text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
            onClick={closeModal}
            disabled={disabled}
          >
            Cancel
          </button>

          <button
            type='button'
            className='flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-red-500 shadow-theme-xs hover:bg-error-600 sm:w-auto disabled:text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
            onClick={action}
            disabled={disabled}
          >
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteModal
