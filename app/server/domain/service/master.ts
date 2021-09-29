
import { GradeType, UnitType, WarehouseType, ReasonType } from "@domain/entity/stock"
import { GradeRepository, UnitRepository, WarehouseRepository, ReasonRepository } from "@domain/repository/interface"
import { FieldNotFoundError } from "$/domain/type/error"

export class GradeService {
  private gradeRepository :GradeRepository
  constructor(gradeRepository: GradeRepository){
    this.gradeRepository = gradeRepository
  }
  async createGrade(entity: GradeType): Promise<GradeType|FieldNotFoundError> {
    const data = await this.gradeRepository.create(entity)
    return data
  }

  async updateGrade(id: number, entity: Partial<GradeType>): Promise<GradeType|FieldNotFoundError> {
    const data = await this.gradeRepository.update(id, entity)
    return data
  }

  async findGradeById(id: number): Promise<GradeType|FieldNotFoundError> {
    const data = await this.gradeRepository.findById(id)
    return data
  }

  async getGradeList():Promise<GradeType[]|FieldNotFoundError>{
    const data = await this.gradeRepository.findAll()
    return data
  }
}

export class UnitService {
  private unitRepository :UnitRepository
  constructor(unitRepository: UnitRepository){
    this.unitRepository = unitRepository
  }
  async createUnit(entity: UnitType): Promise<UnitType|FieldNotFoundError> {
    const data = await this.unitRepository.create(entity)
    return data
  }

  async updateUnit(id: number, entity: Partial<UnitType>): Promise<UnitType|FieldNotFoundError> {
    const data = await this.unitRepository.update(id, entity)
    return data
  }

  async findUnitById(id: number): Promise<UnitType|FieldNotFoundError> {
    const data = await this.unitRepository.findById(id)
    return data
  }

  async getUnitList():Promise<UnitType[]|FieldNotFoundError>{
    const data = await this.unitRepository.findAll()
    return data
  }}

export class WarehouseService {
  private warehouseRepository :WarehouseRepository
  constructor(warehouseRepository: WarehouseRepository){
    this.warehouseRepository = warehouseRepository
  }
  async createWarehouse(entity: WarehouseType): Promise<WarehouseType|FieldNotFoundError> {
    const data = await this.warehouseRepository.create(entity)
    return data
  }

  async updateWarehouse(id: number, entity: Partial<WarehouseType>): Promise<WarehouseType|FieldNotFoundError> {
    const data = await this.warehouseRepository.update(id, entity)
    return data
  }

  async findWarehouseById(id: number): Promise<WarehouseType|FieldNotFoundError> {
    const data = await this.warehouseRepository.findById(id)
    return data
  }

  async getWarehouseList():Promise<WarehouseType[]|FieldNotFoundError>{
    const data = await this.warehouseRepository.findAll()
    return data
  }
}

export class ReasonService {
  private reasonRepository :ReasonRepository
  constructor(reasonRepository: ReasonRepository){
    this.reasonRepository = reasonRepository
  }
  async createReason(entity: ReasonType): Promise<ReasonType|FieldNotFoundError> {
    const data = await this.reasonRepository.create(entity)
    return data
  }

  async updateReason(id: number, entity: Partial<ReasonType>): Promise<ReasonType|FieldNotFoundError> {
    const data = await this.reasonRepository.update(id, entity)
    return data
  }

  async findReasonById(id: number): Promise<ReasonType|FieldNotFoundError> {
    const data = await this.reasonRepository.findById(id)
    return data
  }

  async getReasonList():Promise<ReasonType[]|FieldNotFoundError>{
    const data = await this.reasonRepository.findAll()
    return data
  }

}

