import React, { DetailedHTMLProps, FC, forwardRef, InputHTMLAttributes, LegacyRef, ReactNode } from 'react'

export type InputType = 'text' | 'email' | 'number' | 'date' | 'time' | 'password'

export type InputProps = {
  id: string
  name: string
  label: string
  type: InputType
  className?: string
  placeholder?: string
  append?: string | ReactNode
  prepend?: string | ReactNode
  appendClass?: string
  prependClass?: string
  appendAction?: () => void
  prependAction?: () => void
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const InputComponent: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      type = 'text',
      className = '',
      placeholder = '',
      append,
      prepend,
      appendClass,
      prependClass,
      appendAction,
      prependAction,
      ...props
    },
    ref: LegacyRef<HTMLInputElement>
  ) => {
    return (
      <div className='relative'>
        {prepend && (
          <div
            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
              !prependAction ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
            }`}
          >
            <span
              onClick={prependAction}
              className={prependClass || ''}
            >
              {prepend}
            </span>
          </div>
        )}

        <input
          {...props}
          id={id}
          ref={ref}
          name={name}
          type={type}
          aria-label={label}
          placeholder={placeholder}
          className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            prepend ? 'pl-10' : ''
          } ${append ? 'pr-10' : ''} ${className}`}
        />

        {append && (
          <div
            className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
              !appendAction ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
            }`}
          >
            <span
              onClick={appendAction}
              className={appendClass || ''}
            >
              {append}
            </span>
          </div>
        )}
      </div>
    )
  }
)

InputComponent.displayName = 'Input'

export const Input = InputComponent
