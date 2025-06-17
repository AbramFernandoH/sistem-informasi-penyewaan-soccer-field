import { FC, useRef } from 'react'
import FormLabel from '@/components/cms/FormLabel'

interface DatePickerProps {
  label?: string
  name: string
  value: string
  onChange: (date: string) => void
  min?: string
  max?: string
  className?: string
}

const DatePicker: FC<DatePickerProps> = ({ label, name, value, onChange, min, max, className = '' }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => {
    // Some browsers support showPicker()
    if (inputRef.current && typeof inputRef.current.showPicker === 'function') {
      inputRef.current.showPicker()
    }
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && (
        <FormLabel
          label={label}
          name={name}
        />
      )}

      <div className='relative w-full overflow-hidden rounded-md group'>
        <input
          ref={inputRef}
          id={name}
          type='date'
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          onFocus={handleClick}
          className='px-3 py-2 border rounded-md shadow-sm text-sm border-gray-300 focus:outline-2 focus:outline-indigo-600 focus:border-indigo-600 text-gray-800 h-10 w-full group-hover:bg-gray-50'
        />

        <FormLabel
          name={name}
          className='absolute top-0 left-0 z-[1] w-full h-full opacity-0 group-hover:cursor-pointer'
        />
      </div>
    </div>
  )
}

export default DatePicker
