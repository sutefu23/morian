import { UpdateItemData } from '$/domain/service/stock'
import { PrismaClient } from '@prisma/client'
import { AuthService } from '$/domain/service/auth'
import { ValidationError } from '$/domain/type/error'
import { Decimal } from 'decimal.js'
import { Status } from '@domain/entity/stock'
import { queryPrefix } from './itemType'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

export type getQuery = {
  woodSpeciesId?: number
  itemTypeId?: number
  isDefective?: boolean
  notZero?: boolean
  orderBy?: 'asc' | 'desc'
  limit?: number
  registerFrom?: Date
  registerTo?: Date
}

export const getExsitItemGroupList = async () => {
  return await prisma.item.groupBy({
    by: ['itemTypeId', 'woodSpeciesId']
  })
}

export const getGroupByWarehouseWoodspecies = async () => {
  return await prisma.item.groupBy({
    by: ['warehouseId', 'woodSpeciesId']
  })
}

export const getItemList = async ({ woodSpeciesId, itemTypeId, notZero, isDefective, limit, registerFrom, registerTo, orderBy = 'asc' }: getQuery) => {
  const query = {
    where: {
      woodSpeciesId,
      itemTypeId,
      createdAt: {
        gte: registerFrom ? dayjs(registerFrom).toISOString() : undefined,
        lte: registerTo ? dayjs(registerTo).toISOString() : undefined
      }
    }
  }
  const notZeroQuery = (() => {
    if (notZero) {
      return {
        where: {
          ...query.where,
          count: {
            not: 0
          }
        }
      }
    }
  })()

  const isDefectiveQuery = (() => {
    if (isDefective) {
      return {
        where: {
          OR: [
            {
              defectiveNote: {
                not: null
              }
            },
            {
              defectiveNote: {
                not: ''
              }
            }
          ]
        }
      }
    }
  })()

  const data = await prisma.item.findMany({
    ...query,
    ...notZeroQuery,
    ...isDefectiveQuery,
    orderBy: {
      id: orderBy
    },
    take: limit
  })
  return data
}

export const bulkInsert = async (items: UpdateItemData[]) => {
  const checks = await Promise.all(
    items.map(async (item) => {
      return await checkValidItem(item)
    })
  )

  const errors: Error[] = checks.filter((res): res is Error => res instanceof Error)

  if (errors.length > 0) {
    return errors[0]
  }

  const editUser = AuthService.user()
  if (!editUser) {
    return new Error('認証されたユーザーが見つかりません。')
  }
  const indexes: { [key: number]: number } = {}

  // itemIdごとにグループ化されたアイテムの配列を生成
  const groupedItems = items.map((item) => {
    // itemIdが存在しなければ初期化
    if (indexes[item.itemTypeId] === undefined) {
      indexes[item.itemTypeId] = 0
    } else {
      indexes[item.itemTypeId]++
    }

    // 新しいアイテムを作成し、元のアイテムのプロパティとindexを含める
    return {
      ...item,
      index: indexes[item.itemTypeId]
    }
  })

  const [newItems] = await prisma.$transaction(async (prisma) => {
    const newItems = await Promise.all(
      groupedItems.map(async (item) => {
        const lotNo = await generateLotNo(item.itemTypeId, item.index + 1)
        const { index, ...createItem } = item
        return await prisma.item.create({
          data: {
            ...createItem,
            lotNo,
            length: item.length ? String(item.length) : undefined,
            userId: editUser.id,
            userName: editUser.name
          }
        })
      })
    )

    const newHistories = await Promise.all(
      newItems.map(
        async (item) =>
          await prisma.history.create({
            data: {
              itemId: item.id,
              note: item.note,
              date: item.arrivalDate ?? new Date(),
              status: Status.入庫,
              reasonId: 1, //入庫理由.仕入
              reduceCount: new Decimal(0),
              addCount: item.count,
              editUserId: editUser.id,
              editUserName: editUser.name,
              isTemp: false,
              bookDate: null,
              order: 1
            }
          })
      )
    )
    return [newItems, newHistories]
  })
  return newItems
}

const checkValidItem = async (item: UpdateItemData) => {
  if (item.lotNo) {
    const hasLotNo = await prisma.item.findUnique({
      where: { lotNo: item.lotNo }
    })
    if (hasLotNo) {
      return new Error('ロットNoが既に存在します。' + item.lotNo)
    }
    const prefix = item.lotNo.charAt(0)

    const correctPrefix = await queryPrefix(item.itemTypeId)

    if (prefix !== correctPrefix) {
      return new Error('ロットNoと分類の接頭辞の組み合わせが正しくありません')
    }

    if (!/^[A-Z]+-([0-9]|-)+$/gu.test(item.lotNo)) {
      return new ValidationError('lotNoの形式が正しくありません。英語-数字' + item.lotNo)
    }
  }

  return true
}

/**
 * ロットナンバーの自動生成
 * @param {number} itemTypeId
 * @param {number} [offset=1]
 * @return {string} 新しいロットNo
 */
export const generateLotNo = async (itemTypeId: number, offset = 1) => {
  const itemPrefix = await queryPrefix(itemTypeId)
  const startsLotNo = `${itemPrefix}-${dayjs().format('YYMMDD')}`

  const lastItem = await prisma.item.findFirst({
    where: {
      lotNo: {
        startsWith: startsLotNo
      }
    },
    orderBy: {
      lotNo: 'desc'
    }
  })
  const currentSerialNo = (() => {
    if (!lastItem) {
      return 0
    } else {
      return Number(lastItem.lotNo.split('-')[2] ?? 0)
    }
  })()

  const serialNextNo = currentSerialNo + offset
  return `${startsLotNo}-${('00' + serialNextNo).slice(-2).toString()}`
}
