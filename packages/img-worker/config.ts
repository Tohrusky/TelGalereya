export interface Env {
  CF_NSFW_DETECTOR: string
  CF_NSFW_API_URL: string
  CF_NSFW_DEFAULT_IMAGE: string
}

// @ts-ignore
export const env: Env = process.env

export const NSFW_DETECTOR = Boolean(env.CF_NSFW_DETECTOR) || true

export const NSFW_API_URL = env.CF_NSFW_API_URL || 'https://img-worker-nsfw.vercel.app'

export const NSFW_DEFAULT_IMAGE =
  env.CF_NSFW_DEFAULT_IMAGE || 'https://telegra.ph/file/fb57cac5517050c4726d2.jpg'
