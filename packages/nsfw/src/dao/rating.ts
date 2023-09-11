import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function addRating(hash: string, rating: string) {
  await prisma.rating.create({
    data: {
      hash: hash,
      rating: rating
    }
  })
}

export async function getRating(hash: string) {
  return await prisma.rating.findUnique({
    where: {
      hash: hash
    }
  })
}
