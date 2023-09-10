import { error, json, Router, withParams } from 'itty-router'

// create a new Router
const router = Router()

const a: string = 'Hello SB'

router
  // add some middleware upstream on all routes
  .all('*', withParams)

  // GET list of todos
  .get('/', () => new Response(a))

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
