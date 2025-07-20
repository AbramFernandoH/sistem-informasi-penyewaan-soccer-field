import { FC, useEffect, useState } from 'react'
import DatePicker from '@/components/DatePicker'
import FormInput from '@/components/cms/FormInput'
import FormLabel from '@/components/cms/FormLabel'
import Dropdown, { DropdownOption } from '@/components/cms/Dropdown'

export type FilterProps = {
  handleChangeSearch: (value: string) => void
  sortByOptions: DropdownOption[]
  handleChangeSortBy: (value: DropdownOption) => void
  startDate?: {
    value: string
    onChange: (date: string) => void
  }
  endDate?: {
    value: string
    onChange: (date: string) => void
  }
  showDatePickers?: boolean
  disabledReset?: boolean
  handleClickReset: () => void
}

const Filters: FC<FilterProps> = ({
  handleChangeSearch,
  sortByOptions,
  handleChangeSortBy,
  showDatePickers = false,
  startDate,
  endDate,
  disabledReset = false,
  handleClickReset,
}) => {
  const [search, setSearch] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')
  const [openSortByDropdown, setOpenSortByDropdown] = useState(false)

  const handleClickResetButton = () => {
    handleClickReset()

    setSearch('')
    setOpenSortByDropdown(false)
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(search)
    }, 500) // 500ms debounce

    return () => {
      clearTimeout(handler) // cancel previous timeout
    }
  }, [search])

  useEffect(() => {
    handleChangeSearch(debouncedValue)
    // eslint-disable-next-line
  }, [debouncedValue])

  return (
    <div className='flex items-center space-x-4'>
      <FormInput
        id='search'
        name='search'
        type='text'
        label='Cari'
        placeholder='Ketikan nama data yang ingin dicari'
        wrapperClassName='w-full'
        autoComplete='off'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className='flex flex-col space-y-2 w-full'>
        <FormLabel
          label='Urutkan'
          name='sort-by'
        />

        <Dropdown
          isOpen={openSortByDropdown}
          setIsOpen={setOpenSortByDropdown}
          options={sortByOptions}
          handleClickOption={(option) => {
            handleChangeSortBy(option)

            setOpenSortByDropdown(false)
          }}
        />
      </div>

      {showDatePickers && (
        <>
          {startDate && (
            <DatePicker
              label='Start Date'
              name='startDate'
              value={startDate.value}
              className='w-full'
              max={endDate?.value ?? ''}
              onChange={startDate.onChange}
            />
          )}

          {endDate && (
            <DatePicker
              label='End Date'
              name='endDate'
              value={endDate.value}
              className='w-full'
              min={startDate?.value ?? ''}
              onChange={endDate.onChange}
            />
          )}
        </>
      )}

      <button
        type='button'
        className='self-end h-10 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        disabled={disabledReset}
        onClick={handleClickResetButton}
      >
        Reset
      </button>
    </div>
  )
}

export default Filters
