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
        className='px-3 py-2 border rounded-lg shadow-sm text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 h-10'
      />
    </div>
  )
}

export default DatePicker
