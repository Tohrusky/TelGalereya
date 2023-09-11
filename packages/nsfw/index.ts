import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { loadModel } from './src/utils/nsfw'
import { handleNSFW } from './src/services/nsfw'

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

loadModel().then(() => {
  console.log('model loaded successfully')

  app.listen(3008, () => {
    console.log('3008 is listening')
  })
})
