import { IRequest } from 'itty-router/Router'
import { Base64 } from 'js-base64'
import { NSFWResponseType } from '@img-worker/nsfw/src/types.ts'

export async function handleImage(request: IRequest) {
  const { params } = request
  const tgBaseUrl = 'https://telegra.ph'
  const url = tgBaseUrl + '/file/' + Base64.decode(params.id)

  if (!request.NSFW_DETECTOR) {
    return await fetch(url)
  }

  try {
    const response = await fetch(request.NSFW_API_URL + '/api/v1/nsfw-check/?url=' + url)

    const res: NSFWResponseType = await response.json()
    console.log(res)
    if (res?.status === 'success') {
      // 查询成功，如果是 NSFW 图片，或敏感词长度大于 2，返回默认图片
      // @ts-ignore
      if (res.nsfw || (res.sensitive != 'null' && res.sensitive.length > 2)) {
        return await fetch(request.NSFW_DEFAULT_IMAGE)
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
