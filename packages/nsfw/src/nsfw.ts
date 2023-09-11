import { load, NSFWJS } from './lib/nsfwjs'
import * as tf from '@tensorflow/tfjs'
import sharp from 'sharp'
import { IMAGE_RESIZE } from '../config'

let model: NSFWJS
export async function loadModel() {
  // 加载模型
  if (!model) {
    model = await load()
  }
}

async function loadImageAndConvert(imageUrl: string) {
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`)
  }

  const imageBuffer = await response.arrayBuffer()

  const meta = await sharp(imageBuffer).metadata()

  const reWidth = IMAGE_RESIZE
  // 计算高度，以保持原始宽高比
  const reHeight = Math.round((IMAGE_RESIZE * Number(meta.height)) / Number(meta.width))

  // 创建一个 Uint8Array 来存储图像的像素数据
  const pixelData = new Uint8Array(await sharp(imageBuffer).resize(reWidth, reHeight).toBuffer())
  console.log('pixelData', pixelData)
  // 将图像转换为 Tensor3D
  return tf.browser.fromPixels({ width: reWidth, height: reHeight, data: pixelData })
}

export async function detectImage(imageUrl: string) {
  console.log('detectImage', imageUrl)
  const imageData = await loadImageAndConvert(imageUrl)
  console.log('imageData', imageData)
  // 使用 nsfwjs 进行分类
  const predictions = await model.classify(imageData)
  // 将预测结果转换为一个对象
  const rating: Record<string, number> = {}
  predictions.forEach((predictions) => {
    rating[predictions.className] = predictions.probability
  })
  console.log('rating', rating)
  return rating
}
