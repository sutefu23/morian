import { Supplier } from "@domain/entity/stock";
import { IRepositoryQuery } from "@domain/repository/interface"
import { PrismaRepository } from "./super"
import { RepositoryNotFoundError, ValidationError } from "@domain/type/error";
import { dbModelToEntity } from "../mapper/supplier";

export class SupplierRepositoryQuery extends PrismaRepository implements IRepositoryQuery<Supplier|ValidationError|RepositoryNotFoundError> {
  constructor(){
    super()
  }
  
  async findById(id: number): Promise<Supplier|Error>{
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
} 