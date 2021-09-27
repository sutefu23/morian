import { Decimal } from '@prisma/client/runtime'
import { Item } from "@domain/entity/stock";


export class ItemModel{
  readonly lotNo: string
  readonly itemTypeId: number
  readonly itemTypeName: string
  readonly woodSpeciesId: number
  readonly woodSpeciesName: string
  readonly gradeId: number
  readonly gradeName: string
  readonly spec: string
  readonly length?: string
  readonly thickness?: number
  readonly width?: number
  readonly supplierId: number
  readonly supplierName: string
  readonly packageCount: Decimal
  readonly count: Decimal
  readonly defectiveNote: string
  readonly costPackageCount: Decimal
  readonly cost: Decimal
  readonly costUnitId: number
  readonly costUnitName: string
  readonly tempCount: Decimal
  readonly enable: boolean
  constructor(item: Item){
    this.lotNo = item.lotNo.value
    this.itemTypeId = item.itemType.id
    this.itemTypeName = item.itemType.name
    this.woodSpeciesId = item.woodSpecies.id
    this.woodSpeciesName = item.woodSpecies.name
    this.gradeId = item.grade.id
    this.gradeName = item.grade.name
    this.spec = item.spec
    this.length = (item.length) ? String(item.length.value) : item.length
    this.thickness = item.thickness
    this.width = item.width
    this.supplierId = item.supplier.id
    this.supplierName = item.supplier.name
    this.packageCount = item.packageCount
    this.count = item.count
    this.defectiveNote = item.defectiveNote
    this.costPackageCount = item.costPackageCount
    this.cost = item.cost
    this.costUnitId = item.costUnit.id
    this.costUnitName = item.costUnit.name
    this.tempCount = item.tempCount
    this.enable = item.enable
  }
  
}

