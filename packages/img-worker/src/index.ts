import { error, json, Router } from 'itty-router'
import { handleImage } from './services/image.ts'
import { handleUpload } from './services/upload.ts'
import { handleNSFWCheck } from './services/nsfw.ts'
import { setCFEnv } from './middleware/cfenv.ts'

// create a new Router
const router = Router()

router
  .all('*', setCFEnv)

  .get('/', () => new Response('A Cloudflare Worker for Telegraph image hosting.'))

  .get('/image/:id', handleImage)

  .get('/api/v1/nsfw-check', handleNSFWCheck)

  .post('/api/v1/upload', handleUpload)

  // 404 for everything else
  .all('*', () => error(404))

// Example: Cloudflare Worker module syntax
export default {
  fetch: (request: any, ...args: any[]) =>
    router
      .handle(request, ...args)
      .then(json) // send as JSON
      .catch(error) // catch errors
}
