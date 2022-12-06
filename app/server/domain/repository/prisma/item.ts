import { IItemRepository, Query } from '../interface'
import { Item } from '@domain/entity/stock'
import { Prisma, PrismaClient, Item as ItemModel } from '@prisma/client'
import {
  ValidationError,
  FieldNotFoundError,
  RepositoryNotFoundError
} from '@domain/type/error'
import { dbModelToEntity } from '../mapper/item'
import { ItemDTO } from '@domain/dto/item'
import { UpdateItemData } from '$/domain/service/stock'
import { buildWhereStatement } from './common'
import { generateLotNo } from '$/service/itemList'

export class ItemRepository implements IItemRepository {
  readonly prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }
  create(entity: UpdateItemData): Promise<Item | Error> {
    throw new Error('Method not implemented.')
  }
  findOne?(query: Query<ItemDTO> | Query<ItemDTO>[]): Promise<Item | Error> {
    throw new Error('Method not implemented.')
  }
  findAll?(enable?: boolean | undefined): Promise<Error | Item[]> {
    throw new Error('Method not implemented.')
  }
  filterName?(name: string): Promise<Error | Item[]> {
    throw new Error('Method not implemented.')
  }
  async findMany(
    query: Query<ItemDTO> | Query<ItemDTO>[]
  ): Promise<Error | Item[]> {
    const criteria = buildWhereStatement(query)

    const result = await this.prisma.$queryRaw<ItemModel[]>(
      Prisma.sql`SELECT * FROM Item WHERE ${criteria}`
    )
    const items = (await Promise.all(
      result.map((h) => dbModelToEntity(h))
    )) as Item[]
    return items
  }

  async findById(id: number) {
    const result = await this.prisma.item.findUnique({
      where: { id }
    })
    if (result instanceof Error) {
      return result
    }
    if (!result) {
      return new RepositoryNotFoundError(`itemが見つかりませんid:${id}`)
    }
    const newItem = await dbModelToEntity(result)
    return newItem
  }

  async delete(id: number): Promise<Item | Error> {
    const result = await this.prisma.item.delete({
      where: {
        id
      }
    })
    const deleteItem = await dbModelToEntity(result)
    return deleteItem
  }
  
  async update(
    id: number,
    entity: Partial<UpdateItemData>
  ): Promise<Item | ValidationError | FieldNotFoundError> {
    const newEntity = {
      ...entity,
      lotNo: entity.lotNo,
      length: entity.length ? String(entity.length) : undefined,
      itemTypeId: entity.itemTypeId,
      unitId: entity.unitId,
      costUnitId: entity.costUnitId,
      woodSpeciesId: entity.woodSpeciesId,
      supplierId: entity.supplierId,
      gradeId: entity.gradeId,
      warehouseId: entity.warehouseId,
      cost: entity.cost ? entity.cost.toString() : undefined,
      packageCount: entity.packageCount
        ? entity.packageCount.toString()
        : undefined,
      costPackageCount: entity.costPackageCount
        ? entity.costPackageCount.toString()
        : undefined,
      count: entity.count ? entity.count.toString() : undefined,
      tempCount: entity.tempCount ? entity.tempCount.toString() : undefined
    }

    const result = await this.prisma.item.update({
      where: { id },
      data: newEntity
    })

    const newItem = await dbModelToEntity(result)
    return newItem
  }

  async findByLotNo(lotNo: string): Promise<Item | null | Error> {
    const result = await this.prisma.item.findUnique({
      where: {
        lotNo
      }
    })
    if (!result) return null
    const history = dbModelToEntity(result)
    return history
  }
}
