import { load, NSFWJS } from '../lib/nsfwjs'
import { tensorToHash, loadImageAndConvert } from './tensor'

let model: NSFWJS
export async function loadModel() {
  // 加载模型
  if (!model) {
    model = await load()
  }
}

// 缓存的图片哈希字典
const imageHashDict: Record<string, Record<string, number>> = {}

export async function detectImage(imageUrl: string) {
  console.log('detectImage', imageUrl)
  const imageData = await loadImageAndConvert(imageUrl)
  console.log('imageData', imageData)
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
