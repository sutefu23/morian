import { IRepository } from "../interface";
import { Item} from "@domain/entity/stock";
import { PrismaClient } from '@prisma/client'
import { ValidationError, FieldNotFoundError, RepositoryNotFoundError } from "@domain/type/error";
import { SupplierRepositoryQuery } from "./supplier"
import { dbModelToEntity } from "../mapper/item";

export class ItemRepositoryCommand implements IRepository<Item> {
  readonly prisma :PrismaClient
  readonly supplierRepository: SupplierRepositoryQuery

  constructor(){
    this.prisma = new PrismaClient()
    this.supplierRepository = new SupplierRepositoryQuery()
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

  async create(entity: Item):Promise<Item|ValidationError|FieldNotFoundError> {
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
        {id: entity.supplier.id}
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
  async update(id: number, entity: Partial<Item>):Promise<Item|ValidationError|FieldNotFoundError> {

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
}

