import { UploadResponseType, ErrorResponseType } from '../types'

export function GetUploadResponse(origin_img: string, img: string): UploadResponseType {
  return {
    status: 'success',
    message: 'Upload success!',
    data: {
      origin_img: origin_img,
      img: img
    }
  }
}

export function GetErrorResponse(message: string): ErrorResponseType {
  return {
    status: 'error',
    message: message
  }
}
