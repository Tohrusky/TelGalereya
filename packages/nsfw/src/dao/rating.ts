import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

export async function getRating(hash: string) {
  try {
    return await prisma.rating.findUnique({
      where: {
        hash: hash
      }
    })
  } catch (e) {
    console.log(e)
    return null
  }
}
