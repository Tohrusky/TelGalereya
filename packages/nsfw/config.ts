import 'dotenv/config'

export const IMAGE_RESIZE_WIDTH = Number(process.env.IMAGE_RESIZE_WIDTH) || 225 // -1 means no resize

export const NSFW_VALUE = Number(process.env.NSFW_VALUE) || 0.7 // nsfw value threshold

export const OCR_SENSITIVE = String(process.env.OCR_SENSITIVE).toLowerCase() !== 'false' // OCR image to check sensitive words

export const OCR_API_KEY = process.env.OCR_API_KEY || '' // use your own OCR API key, '' means use Local OCR

export const SENSITIVE_WORDS =
  process.env.SENSITIVE_WORDS ||
  'https://raw.githubusercontent.com/Tohrusky/chinese-sensitive-go/main/dict/boss.txt' // sensitive words dictionary, load online

export const TENSORFLOW_BACKEND = process.env.TENSORFLOW_BACKEND || 'wasm' // tensorflow backend
