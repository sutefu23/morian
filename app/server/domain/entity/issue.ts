import { User } from './user'
import { Supplier } from '@prisma/client'
import { Decimal } from 'decimal.js'

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
  readonly itemTypeName: string
  readonly itemTypeId:number
  readonly woodSpeciesName :string // 樹種
  readonly woodSpeciesId? :number
  readonly spec?:string //仕様
  readonly grade :string 
  readonly gradeId? :number
  readonly length?:string // 寸法（長さ）
  readonly width? :number // 寸法（幅）
  readonly thickness? :number // 寸法（厚）
  readonly packageCount:Decimal // 入数
  readonly costPackageCount:Decimal // 原価単位数量
  readonly count:Decimal // 数量
  readonly unitName:string // 単位
  readonly unitId:number
  readonly arrivalExpectedDate? :string // 入荷予定日
  readonly cost :Decimal // 原価
  readonly costUnitName : string // 原価単位
  readonly costUnitId :number 
}
