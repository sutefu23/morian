import { User } from './user'
import { Prisma, Supplier } from '@prisma/client'

export interface IssueProps {
  readonly id: number
  readonly managedId: string
  readonly date: Date
  readonly userId: User['id']
  readonly userName: User['name']
  readonly supplierId: Supplier['id']
  readonly supplierName: Supplier['name']
  readonly supplierManagerName: string
  readonly expectDeliveryDate: string
  readonly deliveryPlaceId: number
  readonly deliveryPlaceName: string
  readonly deliveryAddress: string
  readonly receiveingStaff: string
  readonly issueNote: string
  readonly innerNote: string
  readonly issueItems: IssueItemProps[]
}

export interface IssueItemProps {
  readonly id: number
  readonly itemTypeId: number
  readonly itemTypeName: string
  readonly woodSpeciesName: string | null // 樹種
  readonly woodSpeciesId: number | null
  readonly spec: string | null //仕様
  readonly manufacturer: string | null //製造元
  readonly gradeId: number | null
  readonly gradeName: string | null
  readonly length: string | null // 寸法（長さ）
  readonly width: number | null // 寸法（幅）
  readonly thickness: number | null // 寸法（厚）
  readonly packageCount: Prisma.Decimal // 入数
  readonly costPackageCount: Prisma.Decimal // 原価単位数量
  readonly count: Prisma.Decimal // 数量
  readonly unitName: string // 単位
  readonly unitId: number
  readonly cost: Prisma.Decimal // 原価
  readonly costUnitName: string // 原価単位
  readonly costUnitId: number
  readonly itemNote: string | null
  readonly isStored: boolean
}
