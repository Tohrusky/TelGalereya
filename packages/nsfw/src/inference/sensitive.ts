import Tesseract from 'tesseract.js'
import { createCanvas, ImageData } from '@napi-rs/canvas'
import * as tf from '@tensorflow/tfjs'
import { OCR_API_KEY } from '../../config'

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
  const time = Date.now()
  const imageBuffer = await TensorToImageBuffer(imageTensor)
  console.log(`TensorToImageBuffer: ${Date.now() - time} ms`)
  if (OCR_API_KEY === '') {
    console.log('OCR_API_KEY is empty, Try use Tesseract.js OCR.')
    // 识别图片中的文字
    const {
      data: { text }
    } = await Tesseract.recognize(imageBuffer, 'chi_sim')
    console.log('OCR Time: ', Date.now() - time)
    return text
  } else {
    console.log('OCR online')

    return ''
  }
}
