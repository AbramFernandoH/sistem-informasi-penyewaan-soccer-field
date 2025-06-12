import { FC, useState } from 'react'
import Dropdown, { DropdownOption } from '@/components/cms/Dropdown'
import FormLabel from '@/components/cms/FormLabel'

type TimeDropdownProps = {
  setSelectedTime: (option: DropdownOption[]) => void
}

const TimeDropdown: FC<TimeDropdownProps> = ({ setSelectedTime }) => {
  const [openTimeDropdown, setOpenTimeDropdown] = useState(false)
  const [timeOptions, setTimeOptions] = useState<DropdownOption[]>(
    Array.from({ length: 15 }).map((_, idx) => ({
      xid: String(idx),
      value: `${7 + idx < 10 ? '0' : ''}${7 + idx}:00 - ${8 + idx < 10 ? '0' : ''}${8 + idx}:00`,
      selected: idx === 0,
    }))
  )

  const handleClickOption = (newSelectedOption: DropdownOption) => {
    const newOptions = timeOptions
    const selectedIndex = newOptions.findIndex((option) => option.xid === newSelectedOption.xid)

    if (selectedIndex !== -1) {
      newOptions.splice(selectedIndex, 1, { ...newSelectedOption, selected: !newSelectedOption.selected })

      setTimeOptions(newOptions)
      setSelectedTime(newOptions.filter((option) => option.selected))
    }
  }

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
      />
    </div>
  )
}

export default TimeDropdown
