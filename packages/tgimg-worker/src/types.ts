export type ImageRespenseType = {
  src?: string
  error?: string
}

interface ApiResponseType<T> {
  status: string
  message: string
  data?: T
}

export type UploadResponseType = ApiResponseType<{
  origin_img: string
  img: string
}>

export type ErrorResponseType = ApiResponseType<null>
