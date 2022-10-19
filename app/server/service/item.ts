import { PrismaClient } from "@prisma/client"
import type { Item } from "@prisma/client"
const prisma = new PrismaClient()

export const registerItems = async (items: Item[]) => {
  return await prisma.item.createMany({
    data:items
  })
}