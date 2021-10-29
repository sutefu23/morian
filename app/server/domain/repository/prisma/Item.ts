import { IItemRepository, Query } from "../interface";
import { Item, ItemProps} from "@domain/entity/stock";
import { Prisma, PrismaClient, Item as ItemModel } from '@prisma/client'
import { ValidationError, FieldNotFoundError, RepositoryNotFoundError } from "@domain/type/error";
import { dbModelToEntity } from "../mapper/item";
import { buildWhereStatement } from "./common";

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

  async create(entity: ItemProps):Promise<Item|ValidationError|FieldNotFoundError> {
    const newEntity = { ...entity,
      lotNo: entity.lotNo?.value,
      length: String(entity.length?.value),
      itemType: {connect: 
        {id: entity.itemType.id}
      },
      unit:{ connect:
        {id: entity.unit.id}
      },
      supplier: { connect:
        {id: entity.supplierId}
      },
      costUnit:{ connect:
        {id: entity.costUnit.id}
      },
      woodSpecies: {connect: 
        {id: entity.woodSpecies.id}
      },
      grade: {connect: 
        {id: entity.grade?.id}
      },
      supplierId: undefined
    }
    const result = await this.prisma.item.create({ data: newEntity })
    const newItem = await dbModelToEntity(result)
    return newItem
  }
  async update(id: number, entity: Partial<ItemProps>):Promise<Item|ValidationError|FieldNotFoundError> {

    const newEntity = { ...entity,
                      lotNo: entity.lotNo?.value,
                      length: String(entity.length?.value),
                      superId: 1,
                      itemType: {connect: 
                        {id: entity.itemType?.id}
                      },
                      unit:{ connect:
                        {id: entity.unit?.id}
                      },
                      costUnit:{ connect:
                        {id: entity.costUnit?.id}
                      },
                      woodSpecies: {connect: 
                        {id: entity.woodSpecies?.id}
                      },
                      supplier: { connect:
                        {id: entity.supplierId}
                      },
                      grade: {connect: 
                        {id: entity.grade?.id}
                      },
                      warehouse: {connect: 
                        {id: entity.warehouse?.id}
                      },
                      arrivalDate: entity.arrivalDate?.toString(),
                      supplierId: undefined
                    }
    const result = await this.prisma.item.update({ where: { id }, data: newEntity })

    const newItem = await dbModelToEntity(result)
    return newItem
  }
  async findMany(query: Query<ItemModel>|Query<ItemModel>[]):Promise<Item[]>{
    const criteria = buildWhereStatement(query)

    const result = await this.prisma.$queryRaw<ItemModel[]>(
      Prisma.sql`SELECT * FROM Item WHERE ${criteria}`
    )
    const histories = await Promise.all(result.map(h => dbModelToEntity(h))) as Item[]
    return histories
  }
}

