import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 写入图片的敏感信息
export async function addSensitive(hash: string, sensitive: string): Promise<void> {
  try {
    await prisma.sensitive.create({
      data: {
        hash: hash,
        sensitive: sensitive
      }
    })
  } catch (e) {
    console.log(e)
  }
}

// 获取图片的敏感信息
export async function getSensitive(hash: string): Promise<string | null> {
  try {
    const r = await prisma.sensitive.findUnique({
      where: {
        hash: hash
      }
    })
    return r ? r.sensitive : null
  } catch (e) {
    console.log(e)
    return null
  }
}
