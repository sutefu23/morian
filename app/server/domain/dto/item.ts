import { Decimal } from 'decimal.js'
import { Item, lotNoType, lengthType } from '@domain/entity/stock'

export type ItemDTO = {
  readonly id: number
  readonly lotNo: string
  readonly issueItemId?: number
  readonly itemTypeId: number
  readonly itemTypeName: string
  readonly itemTypeOrder: number
  readonly woodSpeciesId: number
  readonly woodSpeciesName: string
  readonly woodSpeciesOrder: number
  readonly gradeId?: number
  readonly gradeName?: string
  readonly gradeOrder?: number
  readonly spec?: string
  readonly length?: string
  readonly thickness?: number
  readonly width?: number
  readonly supplierId?: number
  readonly supplierName?: string
  readonly supplierManagerName?: string
  readonly packageCount?: Decimal
  readonly count: Decimal
  readonly tempCount: Decimal
  readonly unitId: number
  readonly unitName: string
  readonly unitOrder: number
  readonly defectiveNote?: string
  readonly costPackageCount?: Decimal
  readonly cost?: Decimal
  readonly costUnitId?: number
  readonly costUnitName?: string
  readonly costUnitOrder?: number
  readonly warehouseId: number
  readonly warehouseName: string
  readonly warehouseOrder: number
  readonly manufacturer?: string
  readonly enable: boolean
  readonly arrivalDate?: Date
  readonly note?: string
}
export const ItemToDTO = (item: Item): ItemDTO => {
  return {
    id: item.id,
    lotNo: item.lotNo.value,
    issueItemId: item.issueItemId,
    itemTypeId: item.itemType.id,
    itemTypeName: item.itemType.name,
    itemTypeOrder: item.itemType.order,
    woodSpeciesId: item.woodSpecies.id,
    woodSpeciesName: item.woodSpecies.name,
    woodSpeciesOrder: item.woodSpecies.order,
    gradeId: item.grade?.id,
    gradeName: item.grade?.name,
    gradeOrder: item.grade?.order,
    spec: item.spec,
    length: item.length ? String(item.length.value) : item.length,
    thickness: item.thickness,
    width: item.width,
    supplierId: item.supplierId,
    supplierName: item.supplierName,
    supplierManagerName: item.supplierManagerName,
    packageCount: item.packageCount,
    count: item.count,
    tempCount: item.tempCount,
    unitId: item.unit.id,
    unitName: item.unit.name,
    unitOrder: item.unit.order,
    warehouseId: item.warehouse.id,
    warehouseName: item.warehouse.name,
    warehouseOrder: item.warehouse.order,
    defectiveNote: item.defectiveNote,
    costPackageCount: item.costPackageCount,
    cost: item.cost,
    costUnitId: item.costUnit?.id,
    costUnitName: item.costUnit?.name,
    costUnitOrder: item.costUnit?.order,
    arrivalDate: item.arrivalDate,
    manufacturer: item.manufacturer,
    note: item.note,
    enable: item.enable
  }
}

export const DtoToItem = (data: ItemDTO) => {
  const lotNo = lotNoType.getInstance(data.lotNo)
  if (lotNo instanceof Error) {
    throw lotNo
  }
  const itemType = {
    id: data.itemTypeId,
    name: data.itemTypeName,
    order: data.itemTypeOrder
  }

  const supplierId = data.supplierId

  const woodSpecies = {
    id: data.woodSpeciesId,
    name: data.woodSpeciesName,
    order: data.woodSpeciesOrder
  }

  const grade = {
    id: data.gradeId,
    name: data.gradeName,
    order: data.gradeOrder
  }

  const costUnit = {
    id: data.costUnitId,
    name: data.costUnitName,
    order: data.costUnitOrder
  }

  const unit = {
    id: data.unitId,
    name: data.unitName,
    order: data.unitOrder
  }

  const warehouse = {
    id: data.warehouseId,
    name: data.warehouseName,
    order: data.warehouseOrder
  }

  const length = ((length) => {
    if (length) {
      return lengthType.getInstance(length)
    }
  })(data.length)

  if (length instanceof Error) {
    throw length
  }

  const width = data.width ?? undefined
  const thickness = data.thickness ?? undefined

  const newItem = {
    ...data,
    itemType: itemType,
    woodSpecies: woodSpecies,
    lotNo: lotNo,
    supplierId,
    length,
    width,
    thickness,
    grade,
    spec: data.spec,
    costUnit,
    unit,
    warehouse
  }
  return newItem
}
