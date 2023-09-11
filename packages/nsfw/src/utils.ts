import * as tf from '@tensorflow/tfjs'
import crypto from 'crypto'
import { createCanvas, Image } from '@napi-rs/canvas'
import { IMAGE_RESIZE_WIDTH } from '../config'

// 将 tf.Tensor3D 张量 转换为普通的 JavaScript 数组，并计算哈希值
export function tensorToHash(tensor: tf.Tensor3D): string {
  const data = tensor.dataSync()
  const shape = tensor.shape
  const flatArray = Array.from(
    { length: shape[0] * shape[1] * shape[2] },
    (_, index) => data[index]
  )
  const hash = crypto.createHash('sha256')
  hash.update(flatArray.join('')) // 将数组拼接成一个字符串并计算哈希值
  return hash.digest('hex')
}

// 把网络请求的图片转换为 tf.Tensor3D 张量
export async function loadImageAndConvert(imageUrl: string) {
  const img = new Image()
  let canvas: any
  let loaded = false

  img.onload = () => {
    console.log('image loaded.')
    // 使用 Canvas 库加载图像并创建画布
    canvas = createCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    loaded = true
  }

  const imgArrayBuffer = await (await fetch(imageUrl)).arrayBuffer()
  img.src = Buffer.from(imgArrayBuffer)

  // 等待图片绘制
  while (!loaded) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  // 将画布中的图像转换为 TensorFlow 张量
  const tensorFromCanvas = tf.browser.fromPixels(canvas)
  console.log('tensorFromCanvas', tensorFromCanvas)
  // 进行图像缩放
  const newWidth = IMAGE_RESIZE_WIDTH
  if (Number(newWidth) === -1) {
    return tensorFromCanvas
  }

  const newHeight = Math.ceil((tensorFromCanvas.shape[0] * newWidth) / tensorFromCanvas.shape[1])

  return tf.image.resizeBilinear(tensorFromCanvas, [newHeight, newWidth]).toInt()
}
