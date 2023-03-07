import {
  UnitType,
} from '@domain/entity/stock'
import { Decimal } from 'decimal.js'

export type UpdateItemData = {
  readonly lotNo?: string
  readonly itemTypeId: number
  readonly itemTypeName: string
  readonly issueItemId?: number
  readonly woodSpeciesId: number
  readonly woodSpeciesName: string
  readonly gradeId?: number
  readonly gradeName?: string
  readonly spec?: string
  readonly length?: number | string
  readonly thickness?: number
  readonly width?: number
  readonly supplierId: number
  readonly supplierName?: string
  readonly supplierManagerName?: string
  readonly packageCount?: Decimal
  readonly packageCountUnitId: UnitType['id']
  readonly packageCountUnitName: UnitType['name']
  readonly count: Decimal
  readonly tempCount: Decimal
  readonly unitId: UnitType['id']
  readonly unitName: UnitType['name']
  readonly costPackageCount?: Decimal
  readonly cost?: Decimal
  readonly costUnitId?: number
  readonly costUnitName?: string
  readonly warehouseId: number
  readonly warehouseName: string
  readonly manufacturer?: string
  readonly arrivalDate: Date
  readonly enable: boolean
  readonly note?: string
  readonly defectiveNote?: string
}
// 直接一部のデータだけを変更する用
export type PartialUpdateItemData = {
  readonly spec?: string
  readonly length?: number | string
  readonly thickness?: number
  readonly width?: number
  readonly packageCount?: Decimal
  readonly packageCountUnitId?: number
  readonly packageCountUnitName?: string
  readonly gradeId?: number
  readonly gradeName?: string
  readonly unitId?: UnitType['id']
  readonly unitName?: UnitType['name']
  readonly costPackageCount?: Decimal
  readonly cost?: Decimal
  readonly costUnitId?: number
  readonly costUnitName?: string
  readonly warehouseId?: number
  readonly warehouseName?: string
  readonly manufacturer?: string
  readonly arrivalDate?: Date
  readonly note?: string,
  readonly defectiveNote?:string
}
  
export type UpdateHistoryData = {
  readonly itemId: number
  readonly note?: string
  readonly date: Date
  readonly status: number
  readonly reasonId: number
  readonly reduceCount: Decimal
  readonly addCount: Decimal
  readonly editUserId: number
  readonly editUserName: string
  readonly bookUserId?: number | null
  readonly bookUserName?: string | null
  readonly bookDate?: Date | null
  readonly isTemp: boolean
}

export type GetParam = {
  woodSpeciesId?: number
  itemTypeId?: number
}


