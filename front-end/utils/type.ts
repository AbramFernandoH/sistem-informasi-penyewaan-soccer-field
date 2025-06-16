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

// Schedule

export type Schedule = {
  _id: string
  field: string
  date: string
  timeSlots: number[]
  reason: string
}

export type CreateScheduleRequest = Omit<Schedule, '_id'>
export type CreateScheduleResponse = BaseResponse<Schedule>
