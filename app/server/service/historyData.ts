import { ITEM_FIELD, Reason, 入庫理由, 出庫理由 } from '$/domain/entity/stock'
import { StockReason } from '$/domain/init/master'
import { UpdateHistoryData } from '$/domain/service/stock'
import { History, Item, PrismaClient } from '@prisma/client'
import { Decimal as PrismaDecimal} from '@prisma/client/runtime'
import { Decimal } from 'decimal.js'
import { getReasonById } from './reason'

const prisma = new PrismaClient()

export const getHistory = async (id: number) => {
  const data = await prisma.history.findUnique({
    where: { id }
  })
  return data
}

export const createHistory = async (history: UpdateHistoryData) => {
  const historyData = checkValidHistory(history)

  const reason = getReasonById(historyData.reasonId)
  const { isTemp, itemField } = whichItemField(reason.name)

  return await prisma.$transaction<[History, Item]>(
    async (prisma) => {
      const maxOrder = await prisma.history.aggregate({
        _max: {
          order: true
        }
      })
      const newHistory = await prisma.history.create({
        data: { ...historyData, isTemp, order:(maxOrder._max.order ?? 0) + 1 }
      })

      const itemParam = itemUpdateParam({
        add:historyData.addCount,
        reduce:historyData.reduceCount,
        mode:"create",
        itemField
      })

      const newItem = await prisma.item.update({
        where: { id: historyData.itemId },
        data: { ...itemParam }
      })
      if (newItem.count.lessThan(0)) {
        throw new Error(`実在庫が0以下になる処置はできません`)
      }
      return [newHistory, newItem]
    }
  )

}

export const updateHistory = async (
  id: number,
  history: UpdateHistoryData
) => {

  const historyData = checkValidHistory(history)

  return await prisma.$transaction<[History,Item]>(
    async (prisma) => {
      
      const updateHistory = await prisma.history.update({
        where:{id},
        data: { ...historyData }
      })
      const reason = getReasonById(updateHistory.reasonId)
      if(reason instanceof Error){
        throw reason
      }
      const { itemField } = whichItemField(reason.name)

      const itemParam = itemUpdateParam({
        add:updateHistory.addCount,
        reduce:updateHistory.reduceCount,
        mode:"delete",
        itemField
      })

      const updateItem = await prisma.item.update({
        where: { id: updateHistory.itemId },
        data: {
          ...itemParam
        }
      })
      if (updateItem.count.lessThan(0)) {
        throw new Error(`実在庫が0以下になる処置はできません`)
      }
      return [updateHistory, updateItem]
    })
}


export const deleteHistory = async(id: number)  => {

  return await prisma.$transaction<[History,Item]>(
    async (prisma) => {
      
      const deleteHistory = await prisma.history.delete({ where: { id } })
      const reason = getReasonById(deleteHistory.reasonId)
      if(reason instanceof Error){
        throw reason
      }
      const { itemField } = whichItemField(reason.name)

      const itemParam = itemUpdateParam({
        add:deleteHistory.addCount,
        reduce:deleteHistory.reduceCount,
        mode:"delete",
        itemField
      })

      const updateItem = await prisma.item.update({
        where: { id: deleteHistory.itemId },
        data: {
          ...itemParam
        }
      })
      if (updateItem.count.lessThan(0)) {
        throw new Error(`実在庫が0以下になる処置はできません`)
      }
      return [deleteHistory, updateItem]
    })
  
}

export const modifyHistoryParam = async (id:number, historyData: Partial<History>) => {
  const data = await prisma.history.update({
    where:{id},
    data: {
      ...historyData,
    }}
  )
  return data
}

const checkValidHistory = (history: UpdateHistoryData) => {
  const reason = StockReason.find((r) => r.id === history.reasonId)?.name
  if (reason == 出庫理由.受注予約 || reason == 出庫理由.見積) {
    if (!history.bookUserId || !history.bookDate || !history.bookUserName) {
      throw new Error('出庫理由が予約か見積の場合は予約者と予約期限は必須です')
    }
  }
  if (!history.reasonId)
    throw new Error('在庫理由は必須です。')
  if (!reason) throw new Error('在庫理由は必須です。')

  if (reason == 出庫理由.不良品 && !history.note) {
    throw new Error('不良品の時は理由を備考に入れてください。')
  }

  return {
    ...history,
    bookUserId: history.bookUserId ?? null,
    bookUserName: history.bookUserName ?? null,
    bookDate: history.bookDate ?? null
  }
}

const whichItemField = (reason: Reason): {
  isTemp: boolean
  itemField: ITEM_FIELD
} => {
  switch (reason) {
    case 出庫理由.見積:
      return { isTemp: true, itemField: ITEM_FIELD.NONE } //引落なし
    case 出庫理由.受注予約:
    case 入庫理由.発注:
      return { isTemp: true, itemField: ITEM_FIELD.TEMP_COUNT } //仮在庫
    case 入庫理由.仕入:
    case 出庫理由.受注出庫:
    case 出庫理由.不良品:
    case 出庫理由.棚卸調整:
    case 入庫理由.棚卸調整:
    case 入庫理由.返品:
      return { isTemp: false, itemField: ITEM_FIELD.BOTH } //両方
    default:
      throw new Error('理由とフィールドの対応が判別できません。')
  }
}

type HistoryParam = {
  add: PrismaDecimal|Decimal,
  reduce: PrismaDecimal|Decimal,
  mode: 'create' | 'update' | 'delete',
  itemField: ITEM_FIELD
} 

const itemUpdateParam = ( historyParam:HistoryParam )=> {

  const {add, reduce, mode, itemField} = historyParam

  const addCount = new PrismaDecimal(add?.toString() ?? 0)
  const reduceCount = new PrismaDecimal(reduce?.toString() ?? 0)

  const count = (() => {
    switch (mode) {
      case 'create':
        return addCount.minus(reduceCount)
      case 'update':
        return addCount.minus(reduceCount)
      case 'delete':
        return reduceCount.minus(addCount)
    }
  })()

  switch (itemField) {
    case ITEM_FIELD.COUNT:
      return {
        count: {
          increment: count
        }
      }
    case ITEM_FIELD.TEMP_COUNT:
      return {
        tempCount: {
          increment: count
        }
      }

    case ITEM_FIELD.BOTH:
      return {
        count: {
          increment: count
        },
        tempCount: {
          increment: count
        }
      }
  }
}

