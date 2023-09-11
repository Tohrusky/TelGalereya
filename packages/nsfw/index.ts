import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { detectImage, loadModel } from './src/nsfw'

if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(`${process.env.PWD}/node_modules/canvas/build/Release:`)
) {
  process.env.LD_LIBRARY_PATH = `${process.env.PWD}/node_modules/canvas/build/Release:${
    process.env.LD_LIBRARY_PATH || ''
  }`
}

const app = new Koa()
const router = new Router()

//路由
router.get('/', async (ctx) => {
  ctx.body = 'A Node.js server for NSFW image classification using TensorFlow.js'
})

router.get('/api/v1/nsfw-check', async (ctx) => {
  const { url } = ctx.query
  ctx.type = 'application/json'

  const res = await detectImage(url as string)

  ctx.body = JSON.stringify(res)
})

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

loadModel().then(() => {
  console.log('model loaded successfully')

  app.listen(3008, () => {
    console.log('3008 is listening')
  })
})
