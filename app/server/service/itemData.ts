import { PartialUpdateItemData } from '$/domain/service/stock'
import { PrismaClient } from '@prisma/client'
import { validLength } from '$/validators/length'

const prisma = new PrismaClient()

export const getItem = async (id: number) => {
  const data = await prisma.item.findUnique({
    where: { id }
  })
  return data
}

export const deleteItem = async (itemId:number) => {
  return await prisma.$transaction(
    async (prisma) => {
      const histories = await prisma.history.findMany({ where: { itemId}})
      if(histories.length > 1){
        throw new Error("明細が2つ以上あるものを削除することは出来ません。");
      }
      const deleteItem = await prisma.item.delete({where:{id: itemId}})
      await prisma.history.deleteMany({ where: { itemId}})
 
      return deleteItem
    })
}

export const modifyItemParam = async (id: number, item: PartialUpdateItemData) => {
  const length = validLength(item.length)

  return await prisma.item.update({
    where: { id },
    data: {...item, length }
  })
}