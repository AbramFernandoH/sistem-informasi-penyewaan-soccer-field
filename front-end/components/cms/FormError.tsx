import React, { FC } from 'react'

type IFormError = {
  className?: string
  message: string
}

const FormError: FC<IFormError> = ({ className = '', message }) => {
  return <span className={`text-xs font-medium leading-[16px] text-red-500 ${className}`}>{message}</span>
}

export default FormError
