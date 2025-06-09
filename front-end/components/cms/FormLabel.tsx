import React, { FC } from 'react'

interface IFormLabel {
  label?: string
  name: string
  className?: string
  withRequiredSign?: boolean
  onClick?: () => void
}

const FormLabel: FC<IFormLabel> = ({
  label = '',
  name,
  className = '',
  withRequiredSign = false,
  onClick = () => {},
}) => {
  return (
    <label
      className={`block text-sm/6 font-medium text-gray-900 ${className}`}
      htmlFor={name}
      onClick={onClick}
    >
      {label || ''} {withRequiredSign && <span className='text-red-500'>*</span>}
    </label>
  )
}

export default FormLabel
