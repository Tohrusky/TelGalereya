import { IRequest } from 'itty-router/Router'
import { Base64 } from 'js-base64'
import { NSFWResponseType } from '@img-worker/nsfw/src/types.ts'
import { Env } from '../types.ts'

export async function handleImage(request: IRequest, env: Env) {
  const { params } = request
  const tgBaseUrl = 'https://telegra.ph'
  const url = tgBaseUrl + '/file/' + Base64.decode(params.id)

  const useDetector =
    env.NSFW_DETECTOR.toLowerCase() === 'false' ? false : Boolean(env.NSFW_DETECTOR)

  if (!useDetector) {
    return await fetch(url)
  }

  await fetch(env.NSFW_API_URL) // 预热 API 服务

  try {
    const response = await fetch(env.NSFW_API_URL + '/api/v1/nsfw-check/?url=' + url)

    const res: NSFWResponseType = await response.json()
    console.log(res)
    if (res?.status === 'success') {
      if (res.nsfw || res.sensitive != 'null') {
        return await fetch(env.NSFW_DEFAULT_IMAGE)
      } else {
        return await fetch(url)
      }
    }
    console.error('Detect NSFW failed, return origin image')
    return await fetch(url)
  } catch (err) {
    console.error(err)
    // Handle error and return an appropriate response
    return await fetch(url)
  }
}
