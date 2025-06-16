import React, { ChangeEvent, ReactNode } from 'react'
import {
  Control,
  Controller,
  FieldErrorsImpl,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form'

import FormError from './FormError'
import FormLabel from './FormLabel'
import { Input, InputProps } from './Input'

export type FormInputProps<TFormValues extends FieldValues> = {
  control?: Control<TFormValues>
  label: string
  name: Path<TFormValues>
  rules?: RegisterOptions<TFormValues>
  register?: UseFormRegister<TFormValues>
  errors?: Partial<FieldErrorsImpl<TFormValues>>
  withRequiredSign?: boolean
  wrapperClassName?: string
  labelClassName?: string
} & Omit<InputProps, 'name'>

const FormInput = <TFormValues extends Record<string, unknown>>({
  control,
  label = '',
  name,
  rules,
  register,
  errors,
  withRequiredSign = false,
  wrapperClassName = '',
  labelClassName = '',
  ...props
}: FormInputProps<TFormValues>): ReactNode => {
  const isError = (errors?.[name.split('.').map((n: string) => n)[0]] as FieldErrorsImpl)?.[props.id]

  return (
    <div className={`flex flex-col space-y-2 ${wrapperClassName}`}>
      {label && (
        <FormLabel
          label={label}
          name={name}
          className={labelClassName}
          withRequiredSign={withRequiredSign}
        />
      )}

      {control && (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target

              if (props.type === 'text') {
                return onChange(String(value).trimStart())
              }

              return onChange(value)
            }

            return (
              <Input
                label={label}
                name={name}
                onChange={handleChange}
                value={value}
                className={error ? 'border-mdi-danger focus:border-mdi-danger' : 'focus:border-mdi-primary'}
                {...props}
                {...(register && register(name, rules))}
              />
            )
          }}
        />
      )}

      {!control && (
        <Input
          label={label}
          name={name}
          className={isError ? 'border-mdi-danger focus:border-mdi-danger' : 'focus:border-mdi-primary'}
          {...props}
          {...(register && register(name, rules))}
        />
      )}

      {errors && errors[name] && errors[name].message && <FormError message={String(errors[name].message)} />}
    </div>
  )
}

export default FormInput
