import Tesseract from 'tesseract.js'
import Mint from 'mint-filter'
import Chinese from 'chinese-s2t'
import { createCanvas, ImageData } from '@napi-rs/canvas'
import * as tf from '@tensorflow/tfjs'
import { OCR_API_KEY, SENSITIVE_WORDS } from '../../config'

async function TensorToImageBuffer(imageTensor: tf.Tensor3D): Promise<Buffer> {
  // 获取图片张量的宽高
  const width = imageTensor.shape[1]
  const height = imageTensor.shape[0]
  // 获取图片张量的数据
  const data = imageTensor.dataSync()
  // 根据宽高创建一个buffer
  const buffer = new Uint8ClampedArray(width * height * 4)
  // 创建一个ImageData对象
  const imageData = new ImageData(width, height)
  // 遍历图片张量的数据，将数据放入buffer中
  let i = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = (y * width + x) * 4 // position in buffer based on x and y
      buffer[pos] = data[i] // some R value [0, 255]
      buffer[pos + 1] = data[i + 1] // some G value
      buffer[pos + 2] = data[i + 2] // some B value
      buffer[pos + 3] = 255 // set alpha channel
      i += 3
    }
  }
  // 将buffer中的数据放入ImageData对象中
  imageData.data.set(buffer)
  // 创建一个canvas
  const canvas: any = createCanvas(width, height)
  const c = canvas.getContext('2d')
  // 将ImageData对象放入canvas中
  c.putImageData(imageData, 0, 0)

  return canvas.toBuffer('image/png')
}

// OCR图片中的文字
export async function OCRRecognize(imageTensor: tf.Tensor3D): Promise<string> {
  const imageBuffer = await TensorToImageBuffer(imageTensor)
  if (OCR_API_KEY === '') {
    console.log('OCR_API_KEY is empty, Try use Tesseract.js OCR.')
    // 识别图片中的文字
    const {
      data: { text }
    } = await Tesseract.recognize(imageBuffer, 'chi_sim+chi_tra')
    return text
  } else {
    console.log('OCR online')

    console.log('Wait to be implemented, return empty string.')

    return ''
  }
}

// ----------------------------------------------- 特色识别 -----------------------------------------------
// 敏感词过滤
let sensitiveWordFilter: Mint
export async function initMintFilter() {
  let time = Date.now()
  // 从网络上获取敏感词库txt文件，每行一个敏感词，使用 \n 分割
  const response = await fetch(SENSITIVE_WORDS)
  const text = await response.text()
  console.log('loadSensitiveWords: ', Date.now() - time, 'ms')
  time = Date.now()
  // 创建 Mint 实例
  sensitiveWordFilter = new Mint(text.split('\n'))
  console.log('initMintFilter: ', Date.now() - time, 'ms')
}

// 识别张量图片中的敏感词，如果没有敏感词，就返回 null
export async function sensitiveWordRecognize(imageTensor: tf.Tensor3D) {
  let sensitiveText: string

  const time = Date.now()
  // OCR 识别原图，返回文字
  sensitiveText = await OCRRecognize(imageTensor)

  console.log('OCR: ', Date.now() - time, 'ms')
  // 预处理文字，统一转换为简体中文
  sensitiveText = sensitiveText.replace(
    /[|\s&%$@*\\/！!#^~_—+=｜﹨'"“；;.。，,、…?？<>《》()（）【】「」：:]+/g,
    ''
  )
  sensitiveText = Chinese.t2s(sensitiveText)
  // 过滤敏感词
  const status = sensitiveWordFilter.filter(sensitiveText, { replace: false })
  console.log('Sensitive: ', Date.now() - time, 'ms')
  if (status.words.length === 0) {
    return 'null'
  }
  // 敏感词数组转字符串，使用 | 分割
  return status.words.toString().replace(/,/g, ' | ')
}
