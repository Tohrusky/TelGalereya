import { IRequest } from 'itty-router/Router'
import { Base64 } from 'js-base64'

export async function handleImage(request: IRequest) {
  const { params } = request
  const url = 'https://telegra.ph/file/' + Base64.decode(params.id)

  return fetch(url)
}
