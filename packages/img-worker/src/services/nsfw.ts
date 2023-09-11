import { IRequest } from 'itty-router/Router'
import { NSFW_API_URL } from '../../config.ts'

export async function handleNSFWCheck(request: IRequest) {
  const { url } = request.query

  await fetch(NSFW_API_URL) // 预热 API 服务

  try {
    return await fetch(NSFW_API_URL + '/api/v1/nsfw-check/?url=' + url)
  } catch (err) {
    return new Response('Error: ' + err, { status: 500 })
  }
}
