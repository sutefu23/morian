import { IItemRepository, Query } from "../interface";
import { Item } from "@domain/entity/stock";
import { Prisma, PrismaClient, Item as ItemModel } from '@prisma/client'
import { ValidationError, FieldNotFoundError, RepositoryNotFoundError } from "@domain/type/error";
import { dbModelToEntity } from "../mapper/item";
import { buildWhereStatement } from "./common";
import { ItemDTO } from "@domain/dto/item"

export class ItemRepository implements IItemRepository {
  readonly prisma :PrismaClient

  constructor(){
    this.prisma = new PrismaClient()
  }
  
  async findById(id: number){
    const result = await this.prisma.item.findUnique({
      where: {id}
    })
    if(result instanceof Error){
      return result
    }
    if(!result){
      return new RepositoryNotFoundError(`itemが見つかりませんid:${id}`)
    }
    const newItem = await dbModelToEntity(result)
    return newItem
  }

  async create(entity: ItemDTO):Promise<Item|ValidationError|FieldNotFoundError> {
    const newEntity = { ...entity,
      lotNo: entity.lotNo,
      length: entity.length,
      manufacturer: entity.manufacturer ?? "",
      itemType: {connect: 
        {id: entity.itemTypeId}
      },
      unit:{ connect:
        {id: entity.unitId}
      },
      supplier: { connect:
        {id: entity.supplierId}
      },
      costUnit:{ connect:
        {id: entity.costUnitId}
      },
      woodSpecies: {connect: 
        {id: entity.woodSpeciesId}
      },
      grade: {connect: 
        {id: entity.gradeId}
      },
      warehouse: {connect: 
        {id: entity.warehouseId}
      },
      supplierId: undefined,
      itemTypeId: undefined,
      woodSpeciesId: undefined,
      gradeId: undefined,
      unitId: undefined,
      costUnitId: undefined,
      warehouseId: undefined,
    }
    const result = await this.prisma.item.create({ data: newEntity })
    const newItem = await dbModelToEntity(result)
    return newItem
  }
  async update(id: number, entity: Partial<ItemDTO>):Promise<Item|ValidationError|FieldNotFoundError> {

    const newEntity = { ...entity,
                      lotNo: entity.lotNo,
                      length: entity.length,
                      itemType: {connect: 
                        {id: entity.itemTypeId}
                      },
                      unit:{ connect:
                        {id: entity.unitId}
                      },
                      costUnit:{ connect:
                        {id: entity.costUnitId}
                      },
                      woodSpecies: {connect: 
                        {id: entity.woodSpeciesId}
                      },
                      supplier: { connect:
                        {id: entity.supplierId}
                      },
                      grade: {connect: 
                        {id: entity.gradeId}
                      },
                      warehouse: {connect: 
                        {id: entity.warehouseId}
                      },
                      arrivalDate: entity.arrivalDate?.toString(),
                      supplierId: undefined,
                      itemTypeId: undefined,
                      woodSpeciesId: undefined,
                      gradeId: undefined,
                      unitId: undefined,
                      costUnitId: undefined,
                      warehouseId: undefined,
                    }
    const result = await this.prisma.item.update({ where: { id }, data: newEntity })

    const newItem = await dbModelToEntity(result)
    return newItem
  }
  async findMany(query: Query<ItemDTO>|Query<ItemDTO>[]):Promise<Item[]>{
    const criteria = buildWhereStatement(query)

    const result = await this.prisma.$queryRaw<ItemModel[]>(
      Prisma.sql`SELECT * FROM Item WHERE ${criteria}`
    )
    const histories = await Promise.all(result.map(h => dbModelToEntity(h))) as Item[]
    return histories
  }
}

