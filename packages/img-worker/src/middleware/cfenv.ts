import { IRequest } from 'itty-router/Router'
import { Env } from '../types.ts'

export async function setCFEnv(request: IRequest, env: Env) {
  request.NSFW_DEFAULT_IMAGE = env.NSFW_DEFAULT_IMAGE

  request.NSFW_DETECTOR =
    env.NSFW_DETECTOR.toLowerCase() === 'false' ? false : Boolean(env.NSFW_DETECTOR)

  if (!env.NSFW_API_URL) {
    console.error('NSFW_API_URL is empty')
    request.NSFW_DETECTOR = false
    return
  }

  // 为了防止 API 服务挂掉，这里使用多个 API 服务 负载均衡
  // 以 ; 分割多个 API 服务地址，去除空地址
  const nsfwApiUrls = env.NSFW_API_URL.split(';').filter((url) => url !== '')
  if (nsfwApiUrls.length === 0) {
    console.error('NSFW_API_URL is empty')
    request.NSFW_DETECTOR = false
    return
  }

  const NSFW_API_URL = nsfwApiUrls[Math.floor(Math.random() * nsfwApiUrls.length)]
  console.log('NSFW_API_URL', NSFW_API_URL)
  request.NSFW_API_URL = NSFW_API_URL
}
