import { load, NSFWJS } from './lib/nsfwjs'
import * as tf from '@tensorflow/tfjs'
import sharp from 'sharp'
import crypto from 'crypto'
import { IMAGE_RESIZE } from '../config'

let model: NSFWJS
export async function loadModel() {
  // 加载模型
  if (!model) {
    model = await load()
  }
}

// 图片哈希字典
const imageHashDict: Record<string, Record<string, number>> = {}

// 将 tf.Tensor3D 转换为普通的 JavaScript 数组，并计算哈希值
function tensorToHash(tensor: tf.Tensor3D): string {
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
  // console.log('pixelData', pixelData)
  // 将图像转换为 Tensor3D
  return tf.browser.fromPixels({ width: reWidth, height: reHeight, data: pixelData })
}

export async function detectImage(imageUrl: string) {
  console.log('detectImage', imageUrl)
  const imageData = await loadImageAndConvert(imageUrl)
  // console.log('imageData', imageData)
  // 计算图像的哈希值
  const imageHash = tensorToHash(imageData)
  console.log('imageHash', imageHash)
  if (imageHashDict[imageHash]) {
    // 如果图像已经被分类过，就直接返回之前的分类结果
    console.log('Image already classified')
    return imageHashDict[imageHash]
  }

  // 使用 nsfwjs 进行分类并计算推理时间
  const startTime = Date.now()
  const predictions = await model.classify(imageData)
  const endTime = Date.now()
  console.log(`Inference took ${endTime - startTime} ms`)
  // 将预测结果转换为一个对象
  const rating: Record<string, number> = {}
  predictions.forEach((predictions) => {
    rating[predictions.className] = predictions.probability
  })
  console.log('rating', rating)

  // 将分类结果存储到哈希字典中
  imageHashDict[imageHash] = rating

  return rating
}
