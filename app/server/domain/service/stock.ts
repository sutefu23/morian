import {
  History,
  Reason,
  ITEM_FIELD,
  出庫理由,
  入庫理由,
  UnitType,
  Status
} from '@domain/entity/stock'
import {
  IItemRepository,
  IHistoryRepository,
  Query,
  IItemTypeRepository
} from '@domain/repository/interface'
import { InvalidArgumentError, ValidationError } from '../type/error'
import { ItemDTO, ItemToDTO } from '../dto/item'
import { HistoryDTO, HistoryToDTO } from '../dto/history'
import { Decimal } from 'decimal.js'
import { HistoryRepository } from '../repository/prisma/history'
import { StockReason } from '../init/master'
import { PrismaClient } from '@prisma/client'
import { AuthService } from './auth'
import { ItemTypeRepository } from '../repository/prisma/master'
const prisma = new PrismaClient()

export type UpdateItemData = {
  readonly lotNo: string
  readonly itemTypeId: number
  readonly itemTypeName: string
  readonly issueItemId?: number
  readonly woodSpeciesId: number
  readonly woodSpeciesName: string
  readonly gradeId?: number
  readonly gradeName?: string
  readonly spec?: string
  readonly length?: number | string
  readonly thickness?: number
  readonly width?: number
  readonly supplierId: number
  readonly supplierName?: string
  readonly supplierManagerName?: string
  readonly packageCount?: Decimal
  readonly count: Decimal
  readonly tempCount: Decimal
  readonly unitId: UnitType['id']
  readonly unitName: UnitType['name']
  readonly costPackageCount?: Decimal
  readonly cost?: Decimal
  readonly costUnitId?: number
  readonly costUnitName?: string
  readonly warehouseId: number
  readonly warehouseName: string
  readonly manufacturer?: string
  readonly arrivalDate: Date
  readonly enable: boolean
  readonly note?: string
  readonly defectiveNote?: string
}

export type UpdateHistoryData = {
  readonly itemId: number
  readonly note?: string
  readonly date: Date
  readonly status: number
  readonly reasonId: number
  readonly reduceCount: Decimal
  readonly addCount: Decimal
  readonly editUserId: number
  readonly editUserName: string
  readonly bookUserId?: number | null
  readonly bookUserName?: string | null
  readonly bookDate?: Date | null
  readonly isTemp: boolean
}

export type GetParam = {
  woodSpeciesId? : number,
  itemTypeId? : number
}

export class ItemService {
  private itemRepository: IItemRepository
  private historyService: HistoryService
  private itemTypeRepository: IItemTypeRepository
  constructor(itemRepo: IItemRepository, historyRepo: HistoryRepository) {
    this.itemRepository = itemRepo
    this.historyService = new HistoryService(historyRepo)
    this.itemTypeRepository = new ItemTypeRepository()
  }
  async findLotNo(lotNo: string) {
    const data = await this.itemRepository.findByLotNo(lotNo)
    return data
  }

  async updateItem(id: number, item: Partial<UpdateItemData>) {
    const data = await this.itemRepository.update(id, item)
    if (data instanceof Error) {
      return data as Error
    }

    const itemDto = ItemToDTO(data)
    return itemDto
  }

  async registerItem(item: UpdateItemData) {
    //仕入
    const hasLotNo = await this.findLotNo(item.lotNo)
    if (hasLotNo instanceof Error) {
      return hasLotNo as Error
    }

    if (hasLotNo) {
      return new Error('ロットNoが既に存在します。' + item.lotNo)
    }
   
    const prefix = item.lotNo.charAt(0)
    const itemTypes = await this.itemTypeRepository?.findAll()
    if (itemTypes instanceof Error) {
      return itemTypes as Error
    }
    if(!itemTypes){
      return new Error('ItemTypeデータが見つかりません')
    }
    const correctPrefix = itemTypes?.find(itm => itm.id === item.itemTypeId)?.prefix
    if(prefix !== correctPrefix){
      return new Error('ロットNoと分類の接頭辞の組み合わせが正しくありません')
    }

    const editUser = AuthService.user()
    if (!editUser) {
      return new Error('認証されたユーザーが見つかりません。')
    }
    if (!/^[A-Z]+-([0-9]|-)+$/gu.test(item.lotNo)) {
      return new ValidationError('lotNoの形式が正しくありません。英語-数字'+ item.lotNo)
    }

    const data = await this.itemRepository.create({...item, count : new Decimal(0),tempCount: new Decimal(0)})
    if (data instanceof Error) {
      return data as Error
    }
    if(item.issueItemId){
      await prisma.issueItem.update({
        where: {
          id:item.issueItemId
        },
        data:{isStored:true}
      })  
    }

    const 仕入詳細 = {
      itemId: data.id,
      note: item.note,
      date: item.arrivalDate ?? new Date(),
      status: Status.入庫,
      reasonId: 1, //入庫理由.仕入
      reduceCount: new Decimal(0),
      addCount: item.count,
      editUserId: editUser.id,
      editUserName: editUser.name,
      isTemp: false
    }

    const historyData = await this.historyService.createHistory(仕入詳細)
    if (historyData instanceof Error) {
      return historyData as Error
    }

    const itemDto = ItemToDTO(data)
    return itemDto
  }
  
  async findItemById(id: number) {
    const data = await this.itemRepository.findById(id)
    if (data instanceof Error) {
      return data as Error
    }
    if (!data.enable) {
      return null
    }
    const itemDto = ItemToDTO(data)
    return itemDto
  }

  async findManyItem(param: GetParam) {
    const margedQuery:(Query<ItemDTO>|undefined)[] = 
    [
      param.woodSpeciesId ? {field:"woodSpeciesId", operator:"=", value: param?.woodSpeciesId }: undefined,
      param.itemTypeId ? {field:"itemTypeId", operator:"=", value: param?.itemTypeId }: undefined
    ]
    const query = margedQuery.filter((item): item is NonNullable<typeof item> => item != null)
    const data = await this.itemRepository.findMany(query)
    if (data instanceof Error) {
      return data as Error
    }
    const item = (() => {
      if (!Object.prototype.hasOwnProperty.call(query, 'enable')) {
        return data.filter((d) => d.enable)
      } else {
        return data
      }
    })()
    return item.map((i) => ItemToDTO(i))
  }

}

export class HistoryService {
  private historyRepository: IHistoryRepository
  constructor(historyRepo: IHistoryRepository) {
    this.historyRepository = historyRepo
  }
  async createHistory(history: UpdateHistoryData) {
    if (!history.reasonId) return new InvalidArgumentError('在庫理由は必須です。')
    const reason = StockReason.find(r => r.id === history.reasonId)
    if(!reason) return new InvalidArgumentError('在庫理由は必須です。')

    if (reason.name == 出庫理由.不良品 && !history.note) {
      return new ValidationError('不良品の時は理由を備考に入れてください。')
    }

    const {isTemp, itemField} = this._whichItemField(reason.name)
    const data = await this.historyRepository.create({...history, isTemp}, itemField)
    if (data instanceof Error) {
      return data as Error
    }
    return HistoryToDTO(data)
  }

  async updateHistory(id: number, history: Partial<UpdateHistoryData>) {
    if (!history.reasonId) return new InvalidArgumentError('在庫理由は必須です。')
    const reason = StockReason.find(r => r.id === history.reasonId)
    if(!reason) return new InvalidArgumentError('在庫理由は必須です。')

    if (reason?.name == 出庫理由.不良品 && !history.note) {
      return new ValidationError('不良品の時は理由を備考に入れてください。')
    }

    const {isTemp, itemField} = this._whichItemField(reason.name) 
    const data = await this.historyRepository.update(
      id,
      {...history, isTemp},
      itemField
    )
    if (data instanceof Error) {
      return data as Error
    }
    return HistoryToDTO(data)
  }
  
  async getHistoryList(itemId: number) {
    const data = await this.historyRepository.findMany({
      field: 'itemId',
      value: itemId,
      operator: '='
    })
    if (data instanceof Error) {
      return data as Error
    }
    return data.map((d) => HistoryToDTO(d))
  }

  async findManyHistory(query: Query<HistoryDTO> | Query<HistoryDTO>[]) {
    const data = await this.historyRepository.findMany(query)
    if (data instanceof Error) {
      return data as Error
    }
    return data.map((d) => HistoryToDTO(d))
  }

  // 予約
  async bookHistory(historyId: number, userId: number, bookDate: Date) {
    const data = await this.historyRepository.update(
      historyId,
      { bookUserId: userId, bookDate },
      ITEM_FIELD.NONE
    )
    if (data instanceof Error) {
      return data as Error
    }
    return data
  }

  // 予約解除
  async unBookHistory(historyId: History['id']) {
    const data = await this.historyRepository.update(
      historyId,
      { bookUserId: null, bookDate: null },
      ITEM_FIELD.NONE
    )
    if (data instanceof Error) {
      return data as Error
    }
    return data
  }

  async deleteHistory(historyId: number) {
    const target = await this.historyRepository.findById(historyId)
    if (!target || target instanceof Error)
      return new InvalidArgumentError('在庫が存在しません。')

    const {itemField} = this._whichItemField(target.reason.name)
    const data = await this.historyRepository.delete(
      historyId,
      target,
      itemField
    )
    if (data instanceof Error) {
      return data as Error
    }
    const [history, item] = data
    return [HistoryToDTO(history), ItemToDTO(item)]
  }
  //どのITEMフィールドを同時に引落すべきか
  private _whichItemField(reason: Reason): {isTemp: boolean, itemField :ITEM_FIELD} {
    switch (reason) {
      case 出庫理由.見積:
        return {isTemp: true, itemField: ITEM_FIELD.NONE} //引落なし
      case 出庫理由.受注予約:
      case 入庫理由.発注:
        return {isTemp: true, itemField: ITEM_FIELD.TEMP_COUNT} //仮在庫
      case 入庫理由.仕入:
      case 出庫理由.受注出庫:
      case 出庫理由.不良品:
      case 出庫理由.棚卸調整:
      case 入庫理由.棚卸調整:
      case 入庫理由.返品:
        return {isTemp: false, itemField: ITEM_FIELD.BOTH} //両方
      default:
        throw new Error("理由とフィールドの対応が判別できません。")
    }
  }
}
