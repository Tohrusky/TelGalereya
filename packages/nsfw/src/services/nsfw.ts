import Koa from 'koa'
import { detectImage } from '../utils/nsfw'
import { NSFWResponseType, NSFWScoreType } from '../types'
import { NSFW_VALUE } from '../../config'

export async function handleNSFW(ctx: Koa.Context) {
  const { url } = ctx.query
  ctx.type = 'application/json'

  const s = await detectImage(url as string)

  const Score: NSFWScoreType = {
    drawing: s['Drawing'],
    hentai: s['Hentai'],
    neutral: s['Neutral'],
    sexy: s['Sexy'],
    porn: s['Porn']
  }

  let nsfw = false
  let resMsg = 'Safe content'
  if (Score.porn + Score.hentai + Score.sexy > NSFW_VALUE) {
    nsfw = true
    if (Score.porn > Score.hentai && Score.hentai > Score.sexy) {
      resMsg = 'NSFW content: Porn'
    } else if (Score.hentai > Score.porn && Score.hentai > Score.sexy) {
      resMsg = 'NSFW content: Hentai'
    } else {
      resMsg = 'NSFW content: Sexy'
    }
  }

  const res: NSFWResponseType = {
    status: 'success',
    message: resMsg,
    url: url as string,
    nsfw: nsfw,
    score: Score
  }

  ctx.body = JSON.stringify(res)
}
