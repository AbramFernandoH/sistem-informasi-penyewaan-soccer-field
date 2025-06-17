import { FC, useState, useEffect } from 'react'
import Dropdown, { DropdownOption } from '@/components/cms/Dropdown'
import FormLabel from '@/components/cms/FormLabel'

type TimeDropdownProps = {
  setSelectedTime: (option: DropdownOption[]) => void
  disabled?: boolean
  resetSignal?: boolean
  options?: DropdownOption[]
}

const getInitialTimeOptions = (): DropdownOption[] =>
  Array.from({ length: 15 }).map((_, idx) => ({
    xid: String(idx),
    value: `${7 + idx < 10 ? '0' : ''}${7 + idx}:00 - ${8 + idx < 10 ? '0' : ''}${8 + idx}:00`,
    selected: idx === 0,
  }))

const TimeDropdown: FC<TimeDropdownProps> = ({ setSelectedTime, disabled, resetSignal, options = [] }) => {
  const [openTimeDropdown, setOpenTimeDropdown] = useState(false)
  const [timeOptions, setTimeOptions] = useState<DropdownOption[]>(
    options.length > 0 ? options : getInitialTimeOptions()
  )

  const handleClickOption = (newSelectedOption: DropdownOption) => {
    const newOptions = timeOptions.map((option) =>
      option.xid === newSelectedOption.xid ? { ...option, selected: !option.selected } : option
    )
    setTimeOptions(newOptions)
    setSelectedTime(newOptions.filter((option) => option.selected))
  }

  useEffect(() => {
    const initial = getInitialTimeOptions()
    setTimeOptions(initial)
    setSelectedTime(initial.filter((opt) => opt.selected))
  }, [resetSignal])

  useEffect(() => {
    if (options.length > 0) {
      setTimeOptions(options)
    }
  }, [options[0]?.xid])

  return (
    <div className='flex flex-col space-y-2 w-full'>
      <FormLabel
        label='Waktu'
        name='time'
      />

      <Dropdown
        isOpen={openTimeDropdown}
        setIsOpen={setOpenTimeDropdown}
        options={timeOptions}
        handleClickOption={handleClickOption}
        disabled={disabled}
      />
    </div>
  )
}

export default TimeDropdown
