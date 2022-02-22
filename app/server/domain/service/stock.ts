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
  Query
} from '@domain/repository/interface'
import { InvalidArgumentError, ValidationError } from '../type/error'
import { ItemDTO, ItemToDTO } from '../dto/item'
import { HistoryDTO, HistoryToDTO } from '../dto/history'
import { Decimal } from 'decimal.js'
import { HistoryRepository } from '../repository/prisma/history'
import { AuthService } from './auth'

export type UpdateItemData = {
  readonly lotNo: string
  readonly itemTypeId: number
  readonly woodSpeciesId: number
  readonly gradeId?: number
  readonly spec?: string
  readonly length: number | '乱尺'
  readonly thickness: number
  readonly width: number
  readonly supplierId: number
  readonly packageCount: Decimal
  readonly count: Decimal
  readonly tempCount: Decimal
  readonly unitId: UnitType['id']
  readonly costPackageCount: Decimal
  readonly cost: Decimal
  readonly costUnitId: number
  readonly warehouseId: number
  readonly manufacturer?: string
  readonly arrivalDate?: Date
  readonly arrivalExpectedDate?: string
  readonly enable: boolean
  readonly note?: string
  readonly defectiveNote?: string
}

export type UpdateHistoryData = {
  readonly itemId: number
  readonly note?: string
  readonly date: Date
  readonly status: number
  readonly reason: Reason
  readonly reduceCount: Decimal
  readonly addCount: Decimal
  readonly editUserId: number
  readonly bookUserId?: number | null
  readonly bookDate?: Date | null
  readonly isTemp: boolean
}

export class ItemService {
  private itemRepository: IItemRepository
  private historyService: HistoryService
  constructor(itemRepo: IItemRepository, historyRepo: HistoryRepository) {
    this.itemRepository = itemRepo
    this.historyService = new HistoryService(historyRepo)
  }
  async findLotNo(lotNo: string) {
    const data = await this.itemRepository.findByLotNo(lotNo)
    return data
  }

  async issueItem(item: UpdateItemData) {
    const hasLotNo = await this.findLotNo(item.lotNo)
    if (hasLotNo instanceof Error) {
      return hasLotNo as Error
    }
    if (hasLotNo) {
      return new Error('ロットNoが既に存在します。')
    }
    const data = await this.itemRepository.create(item)
    if (data instanceof Error) {
      return data as Error
    }

    const editUser = AuthService.user()
    if (!editUser) {
      return new Error('認証されたユーザーが見つかりません。')
    }

    const 発注詳細 = {
      itemId: data.id,
      note: data.note,
      date: new Date(),
      status: Status.入庫,
      reason: 入庫理由.発注,
      reduceCount: new Decimal(0),
      addCount: data.count,
      editUserId: editUser.id,
      isTemp: true
    }

    const historyData = await this.historyService.createHistory(発注詳細)
    if (historyData instanceof Error) {
      return historyData as Error
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
      return new Error('ロットNoが既に存在します。')
    }
    const data = await this.itemRepository.create(item)
    if (data instanceof Error) {
      return data as Error
    }

    const editUser = AuthService.user()
    if (!editUser) {
      return new Error('認証されたユーザーが見つかりません。')
    }

    const 仕入詳細 = {
      itemId: data.id,
      note: data.note,
      date: new Date(),
      status: Status.入庫,
      reason: 入庫理由.発注,
      reduceCount: new Decimal(0),
      addCount: data.count,
      editUserId: editUser.id,
      isTemp: false
    }

    const historyData = await this.historyService.createHistory(仕入詳細)
    if (historyData instanceof Error) {
      return historyData as Error
    }

    const itemDto = ItemToDTO(data)
    return itemDto
  }

  async updateItem(id: number, item: Partial<UpdateItemData>) {
    const data = await this.itemRepository.update(id, item)
    if (data instanceof Error) {
      return data as Error
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
  async findManyItem(query: Query<ItemDTO> | Query<ItemDTO>[]) {
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
    if (!history.reason) return new InvalidArgumentError('在庫理由は必須です。')

    if (history.reason == 出庫理由.不良品 && !history.note) {
      return new ValidationError('不良品の時は理由を備考に入れてください。')
    }

    const itemUpdateWith = this._whichItemField(history.reason)
    const data = await this.historyRepository.create(history, itemUpdateWith)
    if (data instanceof Error) {
      return data as Error
    }
    return HistoryToDTO(data)
  }

  async updateHistory(id: number, history: Partial<UpdateHistoryData>) {
    if (!history.reason) return new InvalidArgumentError('在庫理由は必須です。')
    if (history.reason == 出庫理由.不良品 && !history.note) {
      return new ValidationError('不良品の時は理由を備考に入れてください。')
    }

    const itemUpdateWith = this._whichItemField(history.reason)
    const data = await this.historyRepository.update(
      id,
      history,
      itemUpdateWith
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

    const itemUpdateWith = this._whichItemField(target.reason.name)
    const data = await this.historyRepository.delete(
      historyId,
      target,
      itemUpdateWith
    )
    if (data instanceof Error) {
      return data as Error
    }
    const [history, item] = data
    return [HistoryToDTO(history), ItemToDTO(item)]
  }
  //どのITEMフィールドを同時に引落すべきか
  private _whichItemField(reason: Reason): ITEM_FIELD {
    switch (reason) {
      case 出庫理由.見積:
        return ITEM_FIELD.NONE //引落なし
      case (出庫理由.受注予約, 入庫理由.発注):
        return ITEM_FIELD.TEMP_COUNT //仮在庫
      case (入庫理由.仕入, 出庫理由.受注出庫):
        return ITEM_FIELD.COUNT //実在庫
      case (出庫理由.不良品,
      出庫理由.棚卸調整,
      入庫理由.棚卸調整,
      入庫理由.返品):
        return ITEM_FIELD.BOTH //両方
      default:
        return ITEM_FIELD.NONE
    }
  }
}
