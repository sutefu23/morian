import { User } from './user'
import { Prisma, Supplier } from '@prisma/client'

export interface IssueProps {
  readonly id: number
  readonly managedId: string
  readonly date: Date
  readonly userId: User['id']
  readonly userName: User['name']
  readonly supplierId :Supplier["id"]
  readonly supplierName :Supplier["name"]
  readonly supplierManagerName : string
  readonly expectDeliveryDate : string
  readonly deliveryPlaceId : number
  readonly deliveryPlaceName: string
  readonly deliveryAddress : string
  readonly receiveingStaff : string
  readonly issueNote: string
  readonly innerNote: string
  readonly issueItems: IssueItemProps[]
}

export interface IssueItemProps {
  readonly itemTypeId:number
  readonly itemTypeName: string
  readonly woodSpeciesName :string // 樹種
  readonly woodSpeciesId? :number
  readonly spec?:string //仕様
  readonly gradeId? :number
  readonly gradeName? :string
  readonly length?:string // 寸法（長さ）
  readonly width? :number // 寸法（幅）
  readonly thickness? :number // 寸法（厚）
  readonly packageCount:Prisma.Decimal // 入数
  readonly costPackageCount:Prisma.Decimal // 原価単位数量
  readonly count:Prisma.Decimal // 数量
  readonly unitName:string // 単位
  readonly unitId:number
  readonly arrivalExpectedDate? :string // 入荷予定日
  readonly cost :Prisma.Decimal // 原価
  readonly costUnitName : string // 原価単位
  readonly costUnitId :number 
}
