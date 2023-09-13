import { IRequest } from 'itty-router/Router'
import { Env } from '../types.ts'
import { shuffleArray } from '../utils/random.ts'

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
  shuffleArray(nsfwApiUrls)
  console.log('nsfwApiUrls', nsfwApiUrls)

  if (nsfwApiUrls.length === 0) {
    console.error('NSFW_API_URL is empty')
    request.NSFW_DETECTOR = false
    return
  }

  // 随机选择一个 API 服务地址预热，如果请求失败，就选择下一个，直到成功，失败次数超过总数则放弃
  let NSFW_API_URL = ''
  const time = Date.now()
  for (const url of nsfwApiUrls) {
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        NSFW_API_URL = url
        break
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (NSFW_API_URL === '') {
    console.error('All NSFW api servers down!!!')
    request.NSFW_DETECTOR = false
    return
  }

  console.log('NSFW_API_URL', NSFW_API_URL, 'Select cost', Date.now() - time, 'ms')
  request.NSFW_API_URL = NSFW_API_URL
}
