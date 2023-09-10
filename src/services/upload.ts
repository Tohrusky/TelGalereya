import { IRequest } from 'itty-router/Router'
import { extractBaseUrl } from '../utils/url.ts'
import { Base64 } from 'js-base64'
import type { ImageRespenseType } from '../types.ts'
import { GetErrorResponse, GetUploadResponse } from './response.ts'

export async function handleUpload(request: IRequest): Promise<Response> {
  const tgUrl = 'https://telegra.ph'
  const proxyUrl = await extractBaseUrl(request)

  try {
    // 发送请求并等待响应
    const response = await fetch('https://telegra.ph/upload', {
      method: request.method,
      headers: request.headers,
      body: request.body
    })

    // 检查响应是否成功，通常是状态码为 200
    if (response.status === 200) {
      const res: Array<ImageRespenseType> | ImageRespenseType = await response.json()

      if (!Array.isArray(res)) {
        return new Response(JSON.stringify(GetErrorResponse('Error: ' + res.error)), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      // @ts-ignore
      const img: string = res[0].src.replace('/file/', '')

      const orignImgUrl: string = tgUrl + '/file/' + img
      const proxyImgUrl: string = proxyUrl + '/image/' + Base64.encode(img)

      // 返回 JSON 响应
      return new Response(JSON.stringify(GetUploadResponse(orignImgUrl, proxyImgUrl)), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    return new Response(JSON.stringify(GetErrorResponse('Error: Failed to upload')), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify(GetErrorResponse('Error: ' + error)), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
