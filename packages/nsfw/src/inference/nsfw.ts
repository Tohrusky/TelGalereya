import { load, NSFWJS } from '../lib/nsfwjs'
import { tensorToHash, loadImageAndConvert, resizeImageTensor } from './tensor'
import { addRating, getRating } from '../dao/rating'
import { addSensitive, getSensitive } from '../dao/sensitive'
import { IMAGE_RESIZE_WIDTH } from '../../config'
import { sensitiveWordRecognize } from './sensitive'

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

  const imageTensor = await resizeImageTensor(OriginTensor, IMAGE_RESIZE_WIDTH)
  console.log('ImageTensor: ', imageTensor)
  // 计算图像的哈希值
  const imageHash = tensorToHash(imageTensor)
  console.log('ImageHash: ', imageHash)

  // 分类结果

  let rating: Record<string, number> = {}
  let sensitiveText: string

  // 识别图片中的敏感词

  const historySensitiveText = await getSensitive(imageHash)
  if (historySensitiveText !== 'null') {
    // 如果图像已经被识别过，就直接返回之前的识别结果
    console.log('Image already checked, SensitiveText: ', historySensitiveText)
    sensitiveText = historySensitiveText
  } else {
    // 识别图片中的敏感词
    sensitiveText = await sensitiveWordRecognize(OriginTensor)

    // 将识别结果存储数据库
    await addSensitive(imageHash, sensitiveText)
  }

  // 分类 NSFW 图片

  const historyRating = await getRating(imageHash)
  if (historyRating !== null) {
    // 如果图像已经被分类过，就直接返回之前的分类结果
    console.log('Image already classified, Rating: ', historyRating)
    rating = historyRating
  } else {
    // 使用 nsfwjs 进行分类并计算推理时间
    const time = Date.now()
    const predictions = await model.classify(imageTensor)
    console.log('Inference: ', Date.now() - time, 'ms')

    predictions.forEach((predictions) => {
      rating[predictions.className] = predictions.probability
    })
    console.log('Rating: ', rating)

    // 将分类结果存储数据库
    await addRating(imageHash, JSON.stringify(rating))
  }

  return [rating, sensitiveText]
}
