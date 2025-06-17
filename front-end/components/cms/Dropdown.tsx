'use client'
import React, { Dispatch, SetStateAction } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

export type DropdownOption = {
  xid: string
  value: string
  selected: boolean
  disabled?: boolean
}

type DropdownProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  options: DropdownOption[]
  handleClickOption: (value: DropdownOption) => void
  disabled?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, setIsOpen, options, handleClickOption, disabled = false }) => {
  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)

  return (
    <div className='relative inline-block w-full'>
      <button
        type='button'
        className={`flex items-center justify-between w-full h-10 bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${isOpen ? 'border-indigo-600' : ''}`}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <span
          className='truncate'
          title={
            options.filter((option) => option.selected).length > 0
              ? options
                  .filter((option) => option.selected)
                  .map((opt) => opt.value)
                  .join(', ')
              : 'Select...'
          }
        >
          {options.filter((option) => option.selected).length > 0
            ? options
                .filter((option) => option.selected)
                .map((opt) => opt.value)
                .join(', ')
            : 'Select...'}
        </span>

        {isOpen ? (
          <ChevronUpIcon className='size-5 font-semibold' />
        ) : (
          <ChevronDownIcon className='size-5 font-semibold' />
        )}
      </button>

      {isOpen && (
        <>
          <ul className='absolute z-50 mt-1 w-full max-h-[210px] overflow-auto bg-white border border-gray-300 rounded-md shadow-lg'>
            {options.map((option) => (
              <li
                key={option.xid}
                onClick={(e) => {
                  if ((option.disabled !== undefined && !option.disabled) || option.disabled === undefined) {
                    e.stopPropagation()
                    handleClickOption(option)
                  }
                }}
                className={`px-4 py-2 hover:bg-blue-100 ${
                  option.selected ? 'bg-blue-200 font-medium' : ''
                } ${option.disabled ? 'bg-gray-100 hover:bg-gray-100 hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
              >
                {option.value}
              </li>
            ))}
          </ul>

          {/* Click-outside close area */}
          <div
            className='fixed inset-0 z-40'
            onClick={closeDropdown}
          />
        </>
      )}
    </div>
  )
}

export default Dropdown
