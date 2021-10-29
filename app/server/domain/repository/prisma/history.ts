import { IHistoryRepository, Query } from "../interface";
import { History ,HistoryProps, Item, ITEM_FIELD} from "@domain/entity/stock";
import { Prisma, PrismaClient, History as HistoryModel } from '@prisma/client'
import { ValidationError, FieldNotFoundError, RepositoryNotFoundError } from "@domain/type/error";
import { dbModelToEntity } from "../mapper/history"
import { dbModelToEntity as dbModelToItemEntity} from "../mapper/item";
import { buildWhereStatement } from "./common";

export class HistoryRepository implements IHistoryRepository {
  readonly prisma :PrismaClient

  constructor(){
    this.prisma = new PrismaClient()
  }
  async findById(id: number){
    const result = await this.prisma.history.findUnique({
      where: {id}
    })
    if(result instanceof Error){
      return result
    }
    if(!result){
      return new RepositoryNotFoundError(`historyが見つかりませんid:${id}`)
    }
    const newHistory = await dbModelToEntity(result)
    return newHistory
  }

  async findMany(query: Query<HistoryModel>|Query<HistoryModel>[]):Promise<History[]>{
    const criteria = buildWhereStatement(query)

    const result = await this.prisma.$queryRaw<HistoryModel[]>(
      Prisma.sql`SELECT * FROM History WHERE ${criteria}`
    )
    const histories = await Promise.all(result.map(h => dbModelToEntity(h))) as History[]
    return histories
  }

  async findHistoryListById(itemId: number):Promise<History[]>{
    const result = await this.prisma.history.findMany({
      where:{
        itemId
      }
    })
    const histories = await Promise.all(result.map(h => dbModelToEntity(h))) as History[]
    return histories
  }

  async create(entity: HistoryProps, itemField: ITEM_FIELD):Promise<History|ValidationError|FieldNotFoundError> {
    const maxOrder = await this.prisma.history.aggregate({
      _max: {
        order: true,
      }
    })
    const createParam = { ...entity,
      item: {
        connect: {
          id: entity.itemId
        }
      },
      reason: {
        connect: {
          id: entity.reason?.id
        }
      },
      editUser: {
        connect: {
          id: entity.editUserId
        }
      },
      bookUser: {
        connect: {
          id: entity.bookUserId
        }
      },
      order: (maxOrder._max.order ?? 0) + 1,
      id: undefined,
      itemId: undefined,
      editUserId: undefined,
      bookUserId: undefined,
    }
    const itemUpdateParam = this._itemUpdateParam(entity, itemField)
    
    const result = await this.prisma.history.create({ data: {...createParam, ...itemUpdateParam} })
    const newHistory = await dbModelToEntity(result)
    return newHistory
  }
  async update(id: number, entity: Partial<HistoryProps>, itemField: ITEM_FIELD):Promise<History|ValidationError|FieldNotFoundError> {

    const updateParam = { ...entity,
        item: {
          connect: {
            id: entity.itemId
          }
        },
        editUser: {
          connect: {
            id: entity.editUserId
          }
        },
        bookUser: {
          connect: {
            id: entity.bookUserId
          }
        },
        reason: {
          connect: {
            id: entity.reason?.id
          }
        },
        id: undefined,
        itemId: undefined,
        editUserId: undefined,
        bookUserId: undefined,
      }
      const itemUpdateParam = (() => {
        if(entity.itemId){
          const itemId = entity.itemId
          return this._itemUpdateParam({...entity, itemId}, itemField)
        }
      })()

    const result = await this.prisma.history.update({ where: { id }, data: {...updateParam, ...itemUpdateParam} })

    const newHistory = await dbModelToEntity(result)
    return newHistory
  }

  async delete(id: number, entity: Required<Pick<HistoryProps, 'itemId'>> & Partial<Pick<HistoryProps, 'reduceCount'|'addCount'>>, itemField: ITEM_FIELD):Promise<[History, Item]|ValidationError|FieldNotFoundError>{
    const itemUpdateParam = this._itemUpdateParam({...entity}, itemField)

    const deleteHistory = this.prisma.history.delete({ where: { id } })
    const updateItem = this.prisma.item.update({ where: { id: entity.itemId }, data: {...itemUpdateParam?.item.data} })
      const [historyModel, itemModel] = await this.prisma.$transaction([deleteHistory, updateItem])
    const history = await dbModelToEntity(historyModel)
    if(history instanceof Error){
      return history
    }

    const item = await dbModelToItemEntity(itemModel)
    if(item instanceof Error){
      return item
    }

    return [history, item]
  }

  // Itemのcountフィールドをアップデート
  readonly _itemUpdateParam = (entity: Required<Pick<HistoryProps, 'itemId'>> & Partial<Pick<HistoryProps, 'reduceCount'|'addCount'>>, itemField: ITEM_FIELD) => {
    if(itemField != null){
      
      const isAdd =  (Object.prototype.hasOwnProperty.call(entity, "addCount") && entity.addCount)
      const isReduce =  (Object.prototype.hasOwnProperty.call(entity, "reduceCount") && entity.reduceCount)

      const updateField = (() => {
        if(isAdd){
          switch (itemField) {
            case ITEM_FIELD.COUNT:
              return {
                count: {
                  increment: entity.addCount
                }
              }
            case ITEM_FIELD.TEMP_COUNT:
              return {
                tempCount: {
                  increment: entity.addCount
                }
              }
            
            case ITEM_FIELD.BOTH:
              return {
                count: {
                  increment: entity.addCount,
                },
                tempCount: {
                  increment: entity.addCount
                }
              }
          }
        }
        if(isReduce){
          switch (itemField) {
            case ITEM_FIELD.COUNT:
              return {
                count: {
                  decrement: entity.reduceCount
                }
              }
            case ITEM_FIELD.TEMP_COUNT:
              return {
                tempCount: {
                  decrement: entity.reduceCount
                }
              }
            
            case ITEM_FIELD.BOTH:
              return {
                count: {
                  decrement: entity.reduceCount,
                },
                tempCount: {
                  decrement: entity.reduceCount
                }
              }
          }
        }
      })()

      return {
        item:{
        connect: {id: entity.itemId},
        data: {...updateField}
        }
      }
    }
  }
}

