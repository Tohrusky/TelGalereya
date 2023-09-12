export interface NSFWResponseType {
  status: string
  message: string
  url: string
  sensitive?: string
  nsfw?: boolean
  score?: NSFWScoreType
}

export interface NSFWScoreType {
  drawing: number
  hentai: number
  neutral: number
  sexy: number
  porn: number
}
