import { IRequest } from 'itty-router/Router'
import { detectImage } from '../utils/nsfw.ts'

export async function handleNSFWCheck(request: IRequest) {
  const { url } = request.query

  const res = await detectImage(url as string)

  return new Response(JSON.stringify(res))
}
