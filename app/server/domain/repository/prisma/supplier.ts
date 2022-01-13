import { Supplier, SupplierProps } from "@domain/entity/stock";
import { ISupplierRepository } from "@domain/repository/interface"
import { PrismaRepository } from "./super"
import { RepositoryNotFoundError, ValidationError } from "@domain/type/error";
import { dbModelToEntity } from "../mapper/supplier";
import { FieldNotFoundError } from "$/domain/type/error"


export class SupplierRepository extends PrismaRepository implements ISupplierRepository {
  constructor(){
    super()
  }
  async findAll(enable?:boolean): Promise<Error | Supplier[]> {
    const where = (()=>{
      if(enable){
        return {
          where: {
            enable
          }
        }
      }
    })()
    const results = await this.prisma.supplier.findMany({...where})
    if(!results) {
      return new RepositoryNotFoundError("supplierが見つかりません")
    }
    const suppliers = await Promise.all(results.map(s => dbModelToEntity(s))) as Supplier[]
    return suppliers
  }
  
  async findById(id: number): Promise<SupplierProps|Error>{
    const result = await this.prisma.supplier.findUnique({
      where: {
        id
      }
    })
    if(!result) {
      return new RepositoryNotFoundError("supplierが見つかりません")
    }
    return dbModelToEntity(result)
  }
  async create(entity: SupplierProps): Promise<Supplier|FieldNotFoundError> {
    const data = {
      ...entity,
      furigana: entity.furigana.value,
      zip: entity.zip.value,
      prefecture: entity.prefecture.value,
      tel: entity.tel.value,
      fax: entity.fax?.value,

    }
    const result = await this.prisma.supplier.create({
      data
    })

    const newEntity = dbModelToEntity(result)
    if(newEntity instanceof Error){
      return newEntity as Error
    }
    return newEntity
  }

  async update(id: number, entity: Partial<SupplierProps>): Promise<Supplier|FieldNotFoundError> {
    const data = {
      ...entity,
      furigana: entity.furigana?.value,
      zip: entity.zip?.value,
      prefecture: entity.prefecture?.value,
      tel: entity.tel?.value,
      fax: entity.fax?.value,

    }
    const result = await this.prisma.supplier.update({ where: { id }, data })

    const newEntity = dbModelToEntity(result)
    if(newEntity instanceof Error){
      return newEntity as Error
    }
    return newEntity
  }

} 