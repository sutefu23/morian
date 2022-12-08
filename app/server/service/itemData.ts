import { PartialUpdateItemData } from '$/domain/service/stock'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getItem = async (id: number) => {
  const data = await prisma.item.findUnique({
    where: { id }
  })
  return data
}

export const modifyItemParam = async (id: number, item: PartialUpdateItemData) => {
  return await prisma.item.update({
    where: { id },
    data: {...item }
  })
  

}