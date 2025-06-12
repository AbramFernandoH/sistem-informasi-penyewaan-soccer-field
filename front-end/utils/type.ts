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

export type Field = {
  _id: string
  name: string
  pricePerHour: number
  photo: string
}

export type Admin = {
  _id: string
  fullName: string
  username: string
}
