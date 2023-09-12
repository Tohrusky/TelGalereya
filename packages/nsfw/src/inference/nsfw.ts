import { load, NSFWJS } from '../lib/nsfwjs'
import { tensorToHash, loadImageAndConvert, resizeImageTensor } from './tensor'
import { addRating, getRating } from '../dao/rating'
import { IMAGE_RESIZE_WIDTH, OCR_SENSITIVE } from '../../config'
import { OCRRecognize } from './sensitive'

let model: NSFWJS
export async function loadModel() {
  // 加载模型
  if (!model) {
    model = await load()
  }
}

export async function detectImage(imageUrl: string): Promise<[Record<string, number>, string]> {
  console.log('Image:', imageUrl)
  const OriginTensor = await loadImageAndConvert(imageUrl)

  // 检测出的敏感文字，如果没有敏感文字，就是 null
  let sensitiveText = 'null'
  if (OCR_SENSITIVE) {
    // OCR 识别原图，返回文字
    let ocrText = await OCRRecognize(OriginTensor)

    console.log('OCR Text: ', ocrText)
    sensitiveText = ocrText
  }

  const imageTensor = await resizeImageTensor(OriginTensor, IMAGE_RESIZE_WIDTH)
  console.log('ImageTensor: ', imageTensor)
  // 计算图像的哈希值
  const imageHash = tensorToHash(imageTensor)
  console.log('ImageHash: ', imageHash)

  const historyRating = await getRating(imageHash)
  if (historyRating !== null) {
    // 如果图像已经被分类过，就直接返回之前的分类结果
    const rating = JSON.parse(historyRating.rating)
    console.log('Image already classified, Rating: ', rating)
    return rating
  }

  // 使用 nsfwjs 进行分类并计算推理时间
  const startTime = Date.now()
  const predictions = await model.classify(imageTensor)
  const endTime = Date.now()
  console.log(`Inference: ${endTime - startTime} ms`)
  // 将预测结果转换为一个对象
  const rating: Record<string, number> = {}
  predictions.forEach((predictions) => {
    rating[predictions.className] = predictions.probability
  })
  console.log('Rating: ', rating)

  // 将分类结果存储数据库
  await addRating(imageHash, JSON.stringify(rating))

  return [rating, sensitiveText]
}
