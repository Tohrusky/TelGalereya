import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 写入图片分类的结果
export async function addRating(hash: string, rating: string): Promise<void> {
  try {
    await prisma.rating.create({
      data: {
        hash: hash,
        rating: rating
      }
    })
  } catch (e) {
    console.log(e)
  }
}

// 获取图片分类的结果
export async function getRating(hash: string): Promise<Record<string, number> | null> {
  try {
    const r = await prisma.rating.findUnique({
      where: {
        hash: hash
      }
    })
    return r ? JSON.parse(r.rating) : null
  } catch (e) {
    console.log(e)
    return null
  }
}
