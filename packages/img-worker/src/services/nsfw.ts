import { IRequest } from 'itty-router/Router'
import { Env } from '../types.ts'

export async function handleNSFWCheck(request: IRequest, env: Env) {
  const { url } = request.query

  await fetch(env.NSFW_API_URL) // 预热 API 服务

  try {
    return await fetch(env.NSFW_API_URL + '/api/v1/nsfw-check/?url=' + url)
  } catch (err) {
    return new Response('Error: ' + err, { status: 500 })
  }
}
