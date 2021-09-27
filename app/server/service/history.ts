import { PrismaClient } from '@prisma/client'
import type { History, Item, Prisma } from '$prisma/client'
import { addCount, reduceCount } from './stock'
import { Decimal } from '@prisma/client/runtime'

const prisma = new PrismaClient()

const _updateItem = async (itemId: Item["id"], partialHistory: Prisma.HistoryUpdateInput) => {
  if ({}.hasOwnProperty.call(partialHistory, "addCount") && partialHistory.addCount) {
    await addCount(itemId, new Decimal(partialHistory.addCount as string))
  }
  if ({}.hasOwnProperty.call(partialHistory, "reduceCount") && partialHistory.reduceCount) {
    await reduceCount(itemId, new Decimal(partialHistory.reduceCount as string))
  }
}

export const createHistory = (history:Prisma.HistoryCreateInput) => {
  prisma.history.create(
    {data:history}
  )
  const itemId = history.item?.connect?.id
  if (itemId) {
    _updateItem(itemId, history)
  }
}

export const updateHistory = 
async (id: History['id'], partialHistory: Prisma.HistoryUpdateInput) => {
  prisma.history.update({ where: { id }, data: partialHistory })
  const itemId = partialHistory.item?.connect?.id
  if (itemId) {
    _updateItem(itemId, partialHistory)
  }
}
