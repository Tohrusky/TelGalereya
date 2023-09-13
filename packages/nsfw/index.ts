import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { loadModel } from './src/inference/nsfw'
import { handleNSFW } from './src/services/nsfw'
import { inject } from '@vercel/analytics'
import { initMintFilter } from './src/inference/sensitive'
import { OCR_SENSITIVE } from './config'

inject()

const app = new Koa()
const router = new Router()

//路由
router.get('/', async (ctx) => {
  ctx.body = 'A Node.js server for NSFW image classification using TensorFlow.js'
})

router.get('/api/v1/nsfw-check', handleNSFW)

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

loadModel().then(async () => {
  console.log('model loaded successfully')

  // 预加载敏感词库
  if (OCR_SENSITIVE) {
    await initMintFilter()
  }

  app.listen(3008, () => {
    console.log('3008 is listening')
  })
})

export default app
