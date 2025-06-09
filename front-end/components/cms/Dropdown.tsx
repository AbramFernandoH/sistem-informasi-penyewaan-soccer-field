import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

export type DropdownOption = {
  xid: string
  value: string
  selected: boolean
}

type DropdownProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  options: DropdownOption[]
  handleClickOption: (value: DropdownOption) => () => void
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, setIsOpen, options, handleClickOption }) => {
  const selectedValue = useMemo(() => {
    const selected = options.filter((option) => option.selected)

    if (selected.length > 0) {
      return selected.map((option) => option.value).join(', ')
    }

    return ''
  }, [...options.map((option) => option.selected)])

  const changeIsOpen = (open: boolean) => () => {
    setIsOpen(open)
  }

  return (
    <div className='relative inline-block w-full'>
      <button
        type='button'
        className='flex items-center justify-between w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left text-gray-700 hover:bg-gray-50'
        onClick={changeIsOpen(!isOpen)}
      >
        <span>{selectedValue}</span>

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
                onClick={handleClickOption(option)}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                  option.selected ? 'bg-blue-100 font-medium' : ''
                }`}
              >
                <div className='flex items-center space-x-2'>
                  <span>{option.value}</span>
                </div>
              </li>
            ))}
          </ul>

          <div
            className='bg-transparent fixed z-40 top-[144px] left-0 w-full h-full'
            onClick={changeIsOpen(false)}
          />
        </>
      )}
    </div>
  )
}

export default Dropdown
