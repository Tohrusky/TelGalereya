import { IRequest } from 'itty-router/Router'
import { GetErrorResponse } from './response.ts'

export async function handleNSFWCheck(request: IRequest) {
  const { url } = request.query

  if (!request.NSFW_DETECTOR) {
    return new Response(
      JSON.stringify(GetErrorResponse('NSFW detection is disabled or NSFW_API_URL is empty')),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  await fetch(request.NSFW_API_URL) // 预热 API 服务

  let rUrl = url as string
  const response = await fetch(rUrl)
  if (response.redirected) {
    // 获取重定向后的地址
    rUrl = response.url
  }

  try {
    return await fetch(request.NSFW_API_URL + '/api/v1/nsfw-check/?url=' + rUrl)
  } catch (err) {
    return new Response(JSON.stringify(GetErrorResponse('Error: ' + err)), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
