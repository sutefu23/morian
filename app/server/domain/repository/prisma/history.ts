import { IHistoryRepository, Query } from '../interface'
import { History, Item, ITEM_FIELD } from '@domain/entity/stock'
import { Prisma, PrismaClient, History as HistoryModel, Item as ItemModel } from '@prisma/client'
import {
  ValidationError,
  FieldNotFoundError,
  RepositoryNotFoundError
} from '@domain/type/error'
import { dbModelToEntity } from '../mapper/history'
import { dbModelToEntity as dbModelToItemEntity } from '../mapper/item'
import { buildWhereStatement } from './common'
import { HistoryDTO } from '$/domain/dto/history'
import { UpdateHistoryData } from '$/domain/service/stock'
import { StockReason } from '$/domain/init/master'
import { Decimal } from '@prisma/client/runtime'

export class HistoryRepository implements IHistoryRepository {
  readonly prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }
  async findById(id: number) {
    const result = await this.prisma.history.findUnique({
      where: { id }
    })
    if (result instanceof Error) {
      return result
    }
    if (!result) {
      return new RepositoryNotFoundError(`historyが見つかりませんid:${id}`)
    }
    const newHistory = await dbModelToEntity(result)
    return newHistory
  }

  async findMany(
    query: Query<HistoryDTO> | Query<HistoryDTO>[]
  ): Promise<History[]> {
    const criteria = buildWhereStatement(query)

    const result = await this.prisma.$queryRaw<HistoryModel[]>(
      Prisma.sql`SELECT * FROM History WHERE ${criteria}`
    )
    const histories = (await Promise.all(
      result.map((h) => dbModelToEntity(h))
    )) as History[]
    return histories
  }

  async findHistoryListById(itemId: number): Promise<History[]> {
    const result = await this.prisma.history.findMany({
      where: {
        itemId
      }
    })
    const histories = (await Promise.all(
      result.map((h) => dbModelToEntity(h))
    )) as History[]
    return histories
  }

  async create(
    entity: UpdateHistoryData,
    itemField: ITEM_FIELD
  ): Promise<History | ValidationError | FieldNotFoundError> {
    const maxOrder = await this.prisma.history.aggregate({
      _max: {
        order: true
      }
    })
    const reasons = StockReason.filter((r) => r.id === entity.reasonId)
    if (reasons.length === 0) return Error('理由パラメーターが見つかりません')

    const createParam = {
      ...entity,
      item: {
        connect: {
          id: entity.itemId
        }
      },
      reason: {
        connect: {
          id: reasons[0].id
        }
      },
      editUser: {
        connect: {
          id: entity.editUserId
        }
      },
      order: (maxOrder._max.order ?? 0) + 1,
      reduceCount: entity.reduceCount.toString(),
      addCount: entity.addCount.toString(),
      itemId: undefined,
      editUserId: undefined,
      editUserName: entity.editUserName,
      bookUserId: undefined,
      bookDate: null,
      reasonId: undefined
    }

    const itemUpdateParam = this._itemUpdateParam({ ...entity, itemId:entity.itemId }, 'create', itemField)

    const bookUpdateParam = (() => {
      if (entity.bookUserId) {
        return {
          bookUser: {
            connect: {
              id: entity.bookUserId
            }
          },
          bookUserName: entity.bookUserName ,
          bookDate: entity.bookDate ? entity.bookDate : null
        }
      }
    })()

    const history = await this.prisma.$transaction<HistoryModel>(async (prisma) => {
      const history = await prisma.history.create({
        data: { ...createParam, ...bookUpdateParam }
      })
      const item = await prisma.item.update({
        where:{id: entity.itemId},
        data: {...itemUpdateParam}
      })
      if (item.count.lessThan(0)) {
        throw new Error(`実在庫が0以下になる処置はできません`)
      }
      return history
    })

    const newHistory = await dbModelToEntity(history)
    return newHistory
  }
  async update(
    id: number,
    entity: Partial<HistoryDTO>,
    itemField: ITEM_FIELD
  ): Promise<History | ValidationError | FieldNotFoundError> {
    const reasonId = StockReason.find(r => r.name === entity.reasonName)?.id

    const updateParam = {
      ...entity,
      reason:undefined,
      itemId: entity.itemId,
      editUserId:entity.editUserId,
      editUserName:entity.editUserName,
      reasonId: reasonId,
      reduceCount: entity.reduceCount
        ? entity.reduceCount.toString()
        : undefined,
      addCount: entity.addCount ? entity.addCount.toString() : undefined,
    }
    const itemUpdateParam = (() => {
      if (entity.itemId) {
        const itemId = entity.itemId
        return this._itemUpdateParam({ ...entity, itemId }, 'update',itemField)
      }
    })()

    const bookUpdateParam = (() => {
      if (entity.bookUserId) {
        return {
          bookUserId: entity.bookUserId,
          bookUserName: entity.bookUserName,
          bookDate: entity.bookDate
        }
      }else{
        return {
          bookUserId: null,
          bookUserName: null,
          bookDate: null
        }
      }
    })()


    const history = await this.prisma.$transaction<HistoryModel>(async (prisma) => {
      const history = await prisma.history.update({
        where: { id },
        data: { ...updateParam, ...bookUpdateParam }
      })
      
      const item = await prisma.item.update({
        where: { id: entity.itemId },
        data: {
          ...itemUpdateParam
        }
      })
      if (item.count.lessThan(0)) {
        throw new Error(`実在庫が0以下になる処置はできません`)
      }
      return history
    })

    const newHistory = await dbModelToEntity(history)
    return newHistory
  }

  async delete(
    id: number,
    entity: Required<Pick<HistoryDTO, 'itemId'>> &
      Partial<Pick<HistoryDTO, 'reduceCount' | 'addCount'>>,
    itemField: ITEM_FIELD
  ): Promise<[History, Item] | ValidationError | FieldNotFoundError> {
    const itemUpdateParam = this._itemUpdateParam({ ...entity }, 'delete',itemField)

    const [historyModel, itemModel] = await this.prisma.$transaction<[HistoryModel, ItemModel]>(async (prisma) => {
      const deleteHistory = await prisma.history.delete({ where: { id } })
      const updateItem = await prisma.item.update({
        where: { id: entity.itemId },
        data: {
          ...itemUpdateParam
        }
      })
      if (updateItem.count.lessThan(0)) {
        throw new Error(`実在庫が0以下になる処置はできません`)
      }
      return [deleteHistory, updateItem]
    })
    const history = await dbModelToEntity(historyModel)
    if (history instanceof Error) {
      return history
    }

    const item = await dbModelToItemEntity(itemModel)
    if (item instanceof Error) {
      return item
    }

    return [history, item]
  }

  // Itemのcountフィールドをアップデート
  readonly _itemUpdateParam = (
    entity: Required<Pick<HistoryDTO, 'itemId'>> &
      Partial<Pick<HistoryDTO, 'reduceCount' | 'addCount'>>,
    mode: 'create'|'update'|'delete',
    itemField: ITEM_FIELD
  ) => {
      const addCount = new Decimal(entity.addCount?.toString() ?? 0)
      const reduceCount = new Decimal(entity.reduceCount?.toString() ?? 0)

      const count = (() => {
        switch (mode) {
        case "create":
          return addCount.minus(reduceCount)
        case "update":
          return addCount.minus(reduceCount)
        case "delete":
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
}