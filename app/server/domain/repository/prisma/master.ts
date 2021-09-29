import { PrismaClient, Reason as DbReason } from "@prisma/client"
import { GradeType, UnitType, WarehouseType, ReasonType, 入庫理由, 出庫理由 } from "@domain/entity/stock"
import { IRepository } from "../interface"
import { FieldNotFoundError } from "$/domain/type/error"

const prisma = new PrismaClient()

export class GradeRepository implements IRepository<GradeType> {
  async create(entity: GradeType): Promise<GradeType|FieldNotFoundError> {
    const result = await prisma.grade.create(
      {data: entity}
    )
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      order: result.order
    }
    return data
  }

  async update(id: number, entity: Partial<GradeType>): Promise<GradeType|FieldNotFoundError> {
    const result = await prisma.grade.update(
      {where: {id}, data: entity}
    )
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      order: result.order
    }
    return data
  }

  async findById(id: number): Promise<GradeType|FieldNotFoundError> {
    const result = await prisma.grade.findUnique({
      where: {
        id
      }
    })
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      order: result.order
    }
    return data
  }

  async findAll():Promise<GradeType[]|FieldNotFoundError>{
    const result = await prisma.grade.findMany()
    if(!result){
      return new FieldNotFoundError("データが見つかりません")
    }
    return result
  }
}

export class UnitRepository implements IRepository<UnitType> {
  async update(id: number, entity: Partial<UnitType>): Promise<UnitType | Error> {
    const result = await prisma.unit.update(
      {where: {id}, data: entity}
    )
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      order: result.order
    }
    return data
  }
  async create(entity: UnitType): Promise<UnitType|FieldNotFoundError> {
    const result = await prisma.unit.create(
      {data: entity}
    )
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      order: result.order
    }
    return data
  }

  async findById(id: number): Promise<UnitType|FieldNotFoundError> {
    const result = await prisma.unit.findUnique({
      where: {
        id
      }
    })
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      order: result.order
    }
    return data
  }

  async findAll(){
    return await prisma.unit.findMany()
  }
}

export class WarehouseRepository implements IRepository<WarehouseType> {
  async update(id: number, entity: Partial<WarehouseType>): Promise<WarehouseType | Error> {
    const result = await prisma.warehouse.update(
      {where: {id}, data: entity}
    )
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      order: result.order
    }
    return data
  }
  async create(entity: WarehouseType): Promise<WarehouseType|FieldNotFoundError> {
    const result = await prisma.warehouse.create(
      {data: entity}
    )
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      order: result.order
    }
    return data
  }

  async findById(id: number): Promise<WarehouseType|FieldNotFoundError> {
    const result = await prisma.warehouse.findUnique({
      where: {
        id
      }
    })
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      order: result.order
    }
    return data
  }

  async findAll():Promise<WarehouseType[]|FieldNotFoundError>{
    const result = await prisma.warehouse.findMany()
    if(!result){
      return new FieldNotFoundError("データが見つかりません")
    }
    return result
  }
}

export class ReasonRepository implements IRepository<ReasonType> {
  async update(id: number, entity: Partial<ReasonType>): Promise<FieldNotFoundError | ReasonType> {
    const result = await prisma.reason.update(
      {where: {id}, data: entity}
    )
    if(!result?.id || !result?.name || !result?.order || !result.status){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data:ReasonType = {
      id: result.id,
      name: result.name as 入庫理由|出庫理由,
      status: result.status,
      order: result.order
    }
    return data
  }
  async create(entity: ReasonType): Promise<ReasonType|FieldNotFoundError> {
    const result = await prisma.reason.create(
      {data: entity}
    )
    if(!result?.id || !result?.name || !result?.order || !result.status){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name as 入庫理由|出庫理由,
      status: result.status,
      order: result.order
    }
    return data
  }

  async findById(id: number): Promise<ReasonType|FieldNotFoundError> {
    const result = await prisma.reason.findUnique({
      where: {
        id
      }
    })
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name as 入庫理由|出庫理由,
      status: result.status,
      order: result.order
    }
    return data
  }

  async findAll():Promise<ReasonType[]|FieldNotFoundError>{
    const result = await prisma.reason.findMany()
    if(!result){
      return new FieldNotFoundError("データが見つかりません")
    }
    const reasons = result.map(r => { return {id: r.id, name: r.name as 入庫理由|出庫理由,status : r.status, order: r.order}})
    return reasons
  }

}
