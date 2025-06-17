import Image from 'next/image'
import React, { Fragment, memo, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { Accept, useDropzone } from 'react-dropzone'
import { Control, Controller, FieldErrorsImpl, FieldValues, Path, RegisterOptions } from 'react-hook-form'

import FormError from './FormError'
import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/20/solid'

interface ImageUploaderProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>
  file?: File
  fileUrl?: string
  acceptFiles?: Accept
  name: Path<TFormValues>
  label?: string
  placeholder?: string
  rules?: RegisterOptions<TFormValues>
  errors?: Partial<FieldErrorsImpl<TFormValues>>
  uploading: boolean
  isBrakePointChange?: boolean
  maxSize?: number
  handleRemove?: () => void
  handleDrop?: (file: File) => void
  customInnerDropzone?: ReactNode
}

const ImageUploader = <TFormValues extends FieldValues = FieldValues>({
  control,
  file,
  fileUrl = '',
  label = '',
  placeholder = '',
  name,
  rules,
  errors,
  handleRemove,
  handleDrop,
  maxSize = 2097152, // 2mb
  acceptFiles = {
    'image/png': ['.png'],
    'image/jpg': ['.jpeg', '.jpg'],
  },
  uploading = false,
  isBrakePointChange = false,
  customInnerDropzone,
  ...props
}: ImageUploaderProps<TFormValues>) => {
  const [imgUrl, setImgUrl] = useState('')
  const [fileExtension, setFileExtension] = useState('')
  const ref = useRef(null)

  const { getInputProps, getRootProps, fileRejections } = useDropzone({
    multiple: false,
    accept: acceptFiles,
    maxSize,
    onDrop: (fs: File[]) => {
      const fileExtensions = fs[0].name.split('.')[1]
      setFileExtension(fileExtensions)

      setImgUrl(URL.createObjectURL(fs[0]))

      if (handleDrop) {
        handleDrop(fs[0])
      }
    },
  })

  const handleClickRemoveImg = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setFileExtension('')

    if (handleRemove) {
      handleRemove()
    }

    setImgUrl('')
  }

  useEffect(() => {
    if (file) {
      const fileExtensions = file.name.split('.')[1]
      setFileExtension(fileExtensions)
    }
  }, [file])

  useEffect(() => {
    if (file) {
      const fileExtensions = file.name.split('.')[1]
      setFileExtension(fileExtensions)

      setImgUrl(URL.createObjectURL(file))
    }
  }, [file, isBrakePointChange])

  useEffect(() => {
    if (fileUrl) {
      setImgUrl(fileUrl)
    }
  }, [fileUrl])

  return (
    <div className='relative flex flex-col space-y-2'>
      {/* Remove Button */}
      {!uploading && imgUrl.length > 0 && !customInnerDropzone && (
        <button
          onClick={handleClickRemoveImg}
          type='button'
          className={`absolute top-4 right-3 z-50 h-11 w-11 rounded-md border border-red-600 bg-red-600 p-3 ${imgUrl.length > 0 ? 'visible' : 'invisible'}`}
        >
          <TrashIcon className='size-5 text-white' />
        </button>
      )}

      {fileExtension === 'pdf' ? (
        <div className='relative h-[232px] w-full cursor-pointer overflow-hidden rounded-md border border-dashed p-6'>
          <a
            href={imgUrl}
            target='_blank'
            rel='noreferrer'
          >
            <div className='absolute top-0 left-0 z-[49] flex h-full w-full flex-col justify-center space-x-2 bg-white'>
              <div className='box-border h-[80px] w-full text-center'>
                <Image
                  src='/assets/icons/pdf-uploader-icon.svg'
                  width={80}
                  height={80}
                  alt='pdf-icon'
                />
              </div>

              <p className='text-center text-[13px] font-semibold leading-5 text-dark-2'>{label}</p>
            </div>
          </a>
        </div>
      ) : (
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ fieldState: { error } }) => {
            const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize

            return (
              <div
                className={`relative h-[232px] w-full cursor-pointer overflow-hidden rounded-md border border-dashed p-6 flex justify-center ${imgUrl.length > 0 && 'cursor-default'} ${error ? 'border-red-600' : 'border-[#8758ff]/[0.3]'}`}
                {...getRootProps({})}
              >
                {!uploading && !file && (
                  <Fragment>
                    <input
                      ref={ref}
                      name={name}
                      {...props}
                      {...getInputProps()}
                    />
                    {isFileTooLarge && (
                      <div className='absolute bottom-3 left-[30%] animate-pulse'>
                        <span className='font-poppins text-sm font-normal leading-[150%] text-red-600'>
                          Ukuran File Terlalu Besar
                        </span>
                      </div>
                    )}
                  </Fragment>
                )}

                {customInnerDropzone ? (
                  customInnerDropzone
                ) : (
                  <Fragment>
                    <div
                      className={`flex flex-col items-center justify-center space-y-6 ${imgUrl.length > 0 ? 'invisible' : 'visible'}`}
                    >
                      <ArrowUpTrayIcon className='size-10 font-semibold' />

                      <div className='flex flex-col space-y-2'>
                        <h3 className='text-center font-poppins text-base font-semibold leading-[150%] text-black'>
                          {label}
                        </h3>

                        <p className='text-center font-redHatDisplay text-sm font-normal leading-[150%] text-black'>
                          {placeholder}
                        </p>
                      </div>
                    </div>

                    {/* Preview */}
                    {!['', 'pdf'].includes(fileExtension) && imgUrl.length > 0 && (
                      <Image
                        src={imgUrl}
                        alt='image preview'
                        fill
                        className={`object-contain ${uploading && 'blur-md filter'}`}
                        draggable={false}
                      />
                    )}

                    {/* Overlay Label */}
                    <p
                      className={`absolute bottom-3 left-3 z-10 font-poppins text-[13px] font-semibold leading-[150%] text-white ${imgUrl.length > 0 ? 'visible' : 'invisible'}`}
                    >
                      {label}
                    </p>
                  </Fragment>
                )}
              </div>
            )
          }}
        />
      )}

      {errors && errors[name] && errors[name].message && <FormError message={String(errors[name].message)} />}
    </div>
  )
}

export default memo(ImageUploader) as typeof ImageUploader
