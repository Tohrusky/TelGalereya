import { load } from '../lib/nsfwjs'
import * as tf from '@tensorflow/tfjs'

async function loadImageAndConvert(imageUrl: string) {
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`)
  }

  const imageBuffer = await response.arrayBuffer()

  // 创建一个 Uint8Array 来存储图像的像素数据
  const pixelData = new Uint8Array(imageBuffer)

  // 将图像转换为 Tensor3D
  return tf.browser.fromPixels({ width: 700, height: 700, data: pixelData })
}

export async function detectImage(imageUrl: string) {
  console.log('detectImage', imageUrl)
  const model = await load()
  const imageData = await loadImageAndConvert(imageUrl)
  // 使用 nsfwjs 进行分类
  const predictions = await model.classify(imageData)
  // 将预测结果转换为一个对象
  const rating: Record<string, number> = {}
  predictions.forEach((predictions) => {
    rating[predictions.className] = predictions.probability
  })
  return rating
}
