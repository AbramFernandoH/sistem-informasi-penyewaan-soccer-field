import React, { FC } from 'react'

type IFormError = {
  className?: string
  message: string
}

const FormError: FC<IFormError> = ({ className = '', message }) => {
  return (
    <span className={`font-redHatDisplay text-xs font-medium leading-[16px] text-mdi-danger ${className}`}>
      {message}
    </span>
  )
}

export default FormError
