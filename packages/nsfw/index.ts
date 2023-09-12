import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { loadModel } from './src/inference/nsfw'
import { handleNSFW } from './src/services/nsfw'
import { inject } from '@vercel/analytics'
import { OCRRecognize } from './src/inference/sensitive'
import { loadImageAndConvert } from './src/inference/tensor'

inject()

const app = new Koa()
const router = new Router()

//路由
router.get('/', async (ctx) => {
  const url = 'http://fj.cma.gov.cn/ndsqxj/zwgk/ztzl/xxxsx/zglz/202112/W020211216363067471224.png'
  const time = Date.now()
  ctx.body = await OCRRecognize(await loadImageAndConvert(url))
  console.log(Date.now() - time, 'ms')
  // ctx.body = 'A Node.js server for NSFW image classification using TensorFlow.js'
})

router.get('/api/v1/nsfw-check', handleNSFW)

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

loadModel().then(() => {
  console.log('model loaded successfully')

  app.listen(3008, () => {
    console.log('3008 is listening')
  })
})
