import {  UpdateItemData } from "$/domain/service/stock"
import { PrismaClient } from "@prisma/client"
import { AuthService } from '$/domain/service/auth'
import { ValidationError } from "$/domain/type/error"
import { Decimal } from 'decimal.js'
import {
  History,
  Reason,
  ITEM_FIELD,
  出庫理由,
  入庫理由,
  UnitType,
  Status
} from '@domain/entity/stock'
const prisma = new PrismaClient()

export type getQuery = {
  woodSpeciesId?: number,
  itemTypeId?: number,
  isDefective?: boolean
  notZero?: boolean
}

export const getExsitItemGroupList = async () => {
  return await prisma.item.groupBy({
    by: ['itemTypeId', 'woodSpeciesId'],
  })
}

export const getItemList = async ({woodSpeciesId, itemTypeId, notZero, isDefective}:getQuery) =>{
  const query = {
    where: {
      woodSpeciesId,
      itemTypeId,
    },
  }

  const notZeroQuery = (() => {
    if(notZero){
      return {
          where: {
          count:{
            not:0
          }
        }
      }
    }
  })()

  const isDefectiveQuery = (() => {
    if(isDefective){
      return {
          where: {
            OR:[
              {
                defectiveNote:{
                  not:null
                }
              },
              {
                defectiveNote:{
                  not:""
                }
              }

            ]
        }
      }
    }
  })()

  const data = await prisma.item.findMany({...query,...notZeroQuery,...isDefectiveQuery})
  return data
}

export const bulkInsert = async (items: UpdateItemData[]) => {

  const checks = await Promise.all(items.map(async (item) => {
    return await checkValidItem(item)
  }))
  
  const errors:Error[] = checks.filter((res):res is Error => res instanceof Error)

  if(errors.length > 0){
    return errors[0]
  }
  
  const editUser = AuthService.user()
  if (!editUser) {
    return new Error('認証されたユーザーが見つかりません。')
  }
  const [newItems, _] = await prisma.$transaction(async (prisma) => {
    const newItems = await Promise.all(items.map(async (item)  => await prisma.item.create({
      data: {
        ...item,
        length: String(item.length),
      }
    })))

    const newHistories = await Promise.all(newItems.map(async (item)  => await prisma.history.create({
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
        bookDate:null,
        order:1
      }
    })))
    return [newItems,newHistories]
  })
  return newItems
}

const checkValidItem = async (item:UpdateItemData) => {
  //仕入
  const hasLotNo = await prisma.item.findUnique({where:{lotNo:item.lotNo}})
  if (hasLotNo) {
    return new Error('ロットNoが既に存在します。' + item.lotNo)
  }
 
  const prefix = item.lotNo.charAt(0)
  const itemTypes = await prisma.itemType.findMany()

  if(itemTypes.length === 0){
    return new Error('ItemTypeデータが見つかりません')
  }
  const correctPrefix = itemTypes?.find(itm => itm.id === item.itemTypeId)?.prefix
  if(prefix !== correctPrefix){
    return new Error('ロットNoと分類の接頭辞の組み合わせが正しくありません')
  }

  if (!/^[A-Z]+-([0-9]|-)+$/gu.test(item.lotNo)) {
    return new ValidationError('lotNoの形式が正しくありません。英語-数字'+ item.lotNo)
  }
  return true
}