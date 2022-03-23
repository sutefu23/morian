
import { GradeType, UnitType, WarehouseType, WoodSpeciesType, ReasonType, ItemTypeType, DeliveryPlaceType } from "@domain/entity/stock"
import { IGradeRepository, IUnitRepository,ISpeciesRepository, IWarehouseRepository, IReasonRepository, IItemTypeRepository, IDeliveryPlaceRepository } from "@domain/repository/interface"
import { FieldNotFoundError } from "$/domain/type/error"

export class GradeService {
  private gradeRepository :IGradeRepository
  constructor(gradeRepository: IGradeRepository){
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
  private unitRepository :IUnitRepository
  constructor(unitRepository: IUnitRepository){
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

export class DeliveryPlaceService {
  private warehouseRepository :IDeliveryPlaceRepository
  constructor(warehouseRepository: IDeliveryPlaceRepository){
    this.warehouseRepository = warehouseRepository
  }
  async createDeliveryPlace(entity: DeliveryPlaceType): Promise<DeliveryPlaceType|FieldNotFoundError> {
    const data = await this.warehouseRepository.create(entity)
    return data
  }

  async updateDeliveryPlace(id: number, entity: Partial<DeliveryPlaceType>): Promise<DeliveryPlaceType|FieldNotFoundError> {
    const data = await this.warehouseRepository.update(id, entity)
    return data
  }

  async findDeliveryPlaceById(id: number): Promise<DeliveryPlaceType|FieldNotFoundError> {
    const data = await this.warehouseRepository.findById(id)
    return data
  }

  async getDeliveryPlaceList():Promise<DeliveryPlaceType[]|FieldNotFoundError>{
    const data = await this.warehouseRepository.findAll()
    return data
  }
}

export class WarehouseService {
  private warehouseRepository :IWarehouseRepository
  constructor(warehouseRepository: IWarehouseRepository){
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
  private reasonRepository :IReasonRepository
  constructor(reasonRepository: IReasonRepository){
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

export class SpeciesService {
  private speciesRepository :ISpeciesRepository
  constructor(speciesRepository: ISpeciesRepository){
    this.speciesRepository = speciesRepository
  }
  async createSpecies(entity: WoodSpeciesType): Promise<WoodSpeciesType|FieldNotFoundError> {
    const data = await this.speciesRepository.create(entity)
    return data
  }

  async updateSpecies(id: number, entity: Partial<WoodSpeciesType>): Promise<WoodSpeciesType|FieldNotFoundError> {
    const data = await this.speciesRepository.update(id, entity)
    return data
  }

  async findSpeciesById(id: number): Promise<WoodSpeciesType|FieldNotFoundError> {
    const data = await this.speciesRepository.findById(id)
    return data
  }

  async getSpeciesList():Promise<WoodSpeciesType[]|FieldNotFoundError>{
    const data = await this.speciesRepository.findAll()
    return data
  }
}

export class ItemTypeService {
  private itemTypeRepository :IItemTypeRepository
  constructor(itemTypeRepository: IItemTypeRepository){
    this.itemTypeRepository = itemTypeRepository
  }
  async createItemType(entity: ItemTypeType): Promise<ItemTypeType|FieldNotFoundError> {
    const data = await this.itemTypeRepository.create(entity)
    return data
  }

  async updateItemType(id: number, entity: Partial<ItemTypeType>): Promise<ItemTypeType|FieldNotFoundError> {
    const data = await this.itemTypeRepository.update(id, entity)
    return data
  }

  async findItemTypeById(id: number): Promise<ItemTypeType|FieldNotFoundError> {
    const data = await this.itemTypeRepository.findById(id)
    return data
  }

  async getItemTypeList():Promise<ItemTypeType[]|FieldNotFoundError>{
    const data = await this.itemTypeRepository.findAll()
    return data
  }
}