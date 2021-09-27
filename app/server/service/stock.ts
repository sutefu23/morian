import { PrismaClient } from '@prisma/client'
import type { Item, Prisma } from '$prisma/client'
import { Decimal } from '@prisma/client/runtime'


const prisma = new PrismaClient()

export const getItemById = async (id: number) => await prisma.item.findUnique({where: {id}})

export const updateItem = async (id: Item['id'], partialItem: Prisma.ItemUpdateInput) => 
await prisma.item.update({ where: { id }, data: partialItem })


export const getItemCount = async (id: number) => {
  const item = await getItemById(id)
  return item?.count
}

export const addCount = async (itemId: number, plusCount: Decimal) => {
  const count = await getItemCount(itemId) ?? new Decimal(0)

  return await prisma.item.update({
    where: {id: itemId},
    data: {count : count.add(plusCount)}
  })
}

export const reduceCount = async (itemId: number, minusCount: Decimal) => {
  const count = await getItemCount(itemId) ?? new Decimal(0)

  return await prisma.item.update({
    where: {id: itemId},
    data: {count : count.minus(minusCount)}
  })
}