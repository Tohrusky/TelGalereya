import { IRequest } from 'itty-router/Router'
import { NSFW_API_URL, NSFW_DETECTOR } from '../../config.ts'

export async function handleNSFWCheck(request: IRequest) {
  const { url } = request.query

  if (!NSFW_DETECTOR) {
    return new Response('NSFW_DETECTOR is not set', { status: 400 })
  }

  try {
    return await fetch(NSFW_API_URL + '?url=' + url)
  } catch (err) {
    return new Response('Error: ' + err, { status: 500 })
  }
}
