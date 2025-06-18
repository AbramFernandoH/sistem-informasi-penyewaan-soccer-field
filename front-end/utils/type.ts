export type BaseResponse<D = null> = {
  success: boolean
  message: string
  code: number
  data: D
}

export type ListBaseResponse<I> = BaseResponse<{
  items: I[]
  metadata: {
    count: number
    skip: number
    limit: number
  }
}>

// User

export type User = {
  _id: string
  fullName: string
  email: string
  telephoneNumber: string
}

// Field

export type Field = {
  _id: string
  name: string
  pricePerHour: number
  photo: string
}

export type ListFieldResponse = ListBaseResponse<Field>
export type ListFieldRequest = {
  skip: number
}

export type DetailFieldResponse = BaseResponse<Field>

export type CreateEditFieldRequest = Omit<Field, '_id' | 'pricePerHour'> & {
  pricePerHour: string
}

// Admin

export type Admin = {
  _id: string
  fullName: string
  username: string
}

export type ListAdminResponse = ListBaseResponse<Admin>
export type ListAdminRequest = {
  skip: number
}

export type CreateAdminRequest = Omit<Admin, '_id'> & {
  password: string
  confirmPassword: string
}

export type DetailAdminResponse = BaseResponse<Admin>

export type EditAdminRequest = Omit<Admin, '_id'> &
  Partial<{
    password: string
    confirmPassword: string
  }>

// Schedule

export type Schedule = {
  _id: string
  field: string
  date: string
  timeSlots: number[]
  reason: string
}

export type ListScheduleResponse = ListBaseResponse<Schedule>
export type ListScheduleRequest = Partial<{
  skip: number
  date: string
  fieldId: string
}>

export type DetailScheduleResponse = BaseResponse<
  Omit<Schedule, 'field'> & {
    field: Field
  }
>

export type CreateEditScheduleRequest = Omit<Schedule, '_id'>

// Asset

export type Asset = {
  imageUrl: string
}

export type DetailAssetResponse = BaseResponse<Asset>

export type UploadAssetRequest = {
  file: File
  contentType: string
}
