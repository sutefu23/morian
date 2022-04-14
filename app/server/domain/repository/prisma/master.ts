import { PrismaClient } from "@prisma/client"
import { GradeType, UnitType, WarehouseType, DeliveryPlaceType, ReasonType, ItemTypeType, WoodSpeciesType,入庫理由, 出庫理由 } from "@domain/entity/stock"
import { IGradeRepository, IReasonRepository, ISpeciesRepository, IUnitRepository, IWarehouseRepository, IDeliveryPlaceRepository, IItemTypeRepository } from "../interface"
import { FieldNotFoundError } from "$/domain/type/error"

const prisma = new PrismaClient()

export class GradeRepository implements IGradeRepository {
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

export class UnitRepository implements IUnitRepository {
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

export class WarehouseRepository implements IWarehouseRepository {
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

export class DeliveryPlaceRepository implements IDeliveryPlaceRepository {
  async update(id: number, entity: Partial<DeliveryPlaceType>): Promise<DeliveryPlaceType | Error> {
    const result = await prisma.deliveryPlace.update(
      {where: {id}, data: entity}
    )
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      address: result.address,
      order: result.order
    }
    return data
  }
  async create(entity: DeliveryPlaceType): Promise<DeliveryPlaceType|FieldNotFoundError> {
    const result = await prisma.deliveryPlace.create(
      {data: entity}
    )
    if(!result?.id || !result?.name || !result?.order){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      address: result.address,
      order: result.order
    }
    return data
  }

  async findById(id: number): Promise<DeliveryPlaceType|FieldNotFoundError> {
    const result = await prisma.deliveryPlace.findUnique({
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
      address: result.address,
      order: result.order
    }
    return data
  }

  async findAll():Promise<DeliveryPlaceType[]|FieldNotFoundError>{
    const result = await prisma.deliveryPlace.findMany()
    if(!result){
      return new FieldNotFoundError("データが見つかりません")
    }
    return result
  }
}


export class ReasonRepository implements IReasonRepository {
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

export class WoodSpeciesRepository implements ISpeciesRepository {
  async update(id: number, entity: Partial<WoodSpeciesType>): Promise<WoodSpeciesType | Error> {
    const result = await prisma.species.update(
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
  async create(entity: WoodSpeciesType): Promise<WoodSpeciesType|FieldNotFoundError> {
    const result = await prisma.species.create(
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

  async findById(id: number): Promise<WoodSpeciesType|FieldNotFoundError> {
    const result = await prisma.species.findUnique({
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

  async findAll():Promise<WoodSpeciesType[]|FieldNotFoundError>{
    const result = await prisma.species.findMany()
    if(!result){
      return new FieldNotFoundError("データが見つかりません")
    }
    return result
  }
}

export class ItemTypeRepository implements IItemTypeRepository {
  async update(id: number, entity: Partial<ItemTypeType>): Promise<ItemTypeType | Error> {
    const result = await prisma.itemType.update(
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
  async create(entity: ItemTypeType): Promise<ItemTypeType|FieldNotFoundError> {
    const result = await prisma.itemType.create(
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

  async findById(id: number): Promise<ItemTypeType|FieldNotFoundError> {
    const result = await prisma.itemType.findUnique({
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

  async findAll():Promise<ItemTypeType[]|FieldNotFoundError>{
    const result = await prisma.itemType.findMany()
    if(!result){
      return new FieldNotFoundError("データが見つかりません")
    }
    return result
  }
}