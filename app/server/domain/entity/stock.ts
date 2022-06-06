import { ValueObject } from '../type/valueObject'
import { Entity } from '../type/entity'
import { Decimal } from 'decimal.js'
import { ValidationError, InvalidArgumentError } from '../type/error'
import { User } from './user'

export class lotNoType extends ValueObject<string> {
  private constructor(val: string) {
    super(val)
  }

  static getInstance(val: string): lotNoType | ValidationError {
    if (!/^[A-Z]+-([0-9]|-)+$/gu.test(val)) {
      return new ValidationError('lotNoの形式が正しくありません。英語-数字'+ val)
    }
    return new this(val)
  }
}

export interface Master {
  readonly id: number
  readonly name: string
  readonly order: number
}

export type ItemTypeType = Master
export type UnitType = Master
export type WoodSpeciesType = Master
export type WarehouseType = Master
export type GradeType = Master
export type DeliveryPlaceType = Master & { address : string }

export type specType = string

export class furiganaType extends ValueObject<string> {
  private constructor(val: string) {
    super(val)
  }

  static getInstance(val: string): furiganaType | ValidationError {
    if (!/^[ぁ-ヴー]+$/gu.test(val)) {
      return new ValidationError('フリガナの形式が正しくありません。(全角ひらがなのみ)')
    }
    return new this(val)
  }
}

export class zipType extends ValueObject<string> {
  private constructor(val: string) {
    super(val)
  }

  static getInstance(val: string): zipType | ValidationError {
    if (!/^[0-9]{3}-[0-9]{4}$/gu.test(val)) {
      return new ValidationError('郵便番号の形式が正しくありません。')
    }
    return new this(val)
  }
}

export class CountType extends ValueObject<number> {
  private constructor(val: number) {
    super(val)
  }
  static getInstance(val: number): CountType | ValidationError {
    if (val < 0) {
      return new ValidationError('Countはマイナス値に出来ません。')
    }
    return new this(val)
  }
}

export class lengthType extends ValueObject<number | '乱尺'> {
  private constructor(val: number | '乱尺') {
    super(val)
  }
  static getInstance(val: number | string): lengthType | ValidationError {
    if (
      !/^[-]?([1-9]\d*|0)(\.\d+)?$/g.test(String(val)) 
    ) {
      if(String(val) != '乱尺'){
        return new ValidationError(
          'lengthは数値あるいは「乱尺」という言葉だけが許可されています。'
        )
      }
    }
    return new this(val as number | '乱尺')
  }
}

export interface ItemProps {
  readonly id: number
  readonly lotNo: lotNoType
  readonly issueItemId?: number
  readonly itemType: ItemTypeType
  readonly woodSpecies: WoodSpeciesType
  readonly grade?: GradeType
  readonly spec?: specType
  readonly length?: lengthType
  readonly thickness?: number
  readonly width?: number
  readonly supplierId: Supplier['id']
  readonly arrivalDate?: Date
  readonly packageCount: Decimal
  readonly costPackageCount: Decimal
  readonly cost: Decimal
  readonly warehouse: WarehouseType
  readonly costUnit: UnitType
  readonly defectiveNote?: string
  readonly manufacturer?: string
  readonly count: Decimal
  readonly unit: UnitType
  readonly tempCount: Decimal
  readonly note?: string
  readonly enable: boolean
}

export class Item extends Entity<ItemProps> implements ItemProps {
  readonly lotNo: lotNoType
  readonly itemType: ItemTypeType
  readonly issueItemId?: number
  readonly woodSpecies: WoodSpeciesType
  readonly grade?: GradeType
  readonly spec?: string
  readonly arrivalDate?: Date
  readonly length?: lengthType
  readonly thickness?: number
  readonly width?: number
  readonly supplierId: Supplier['id']
  readonly supplierName: Supplier['name']
  readonly packageCount: Decimal
  readonly count: Decimal
  readonly unit: UnitType
  readonly warehouse: WarehouseType
  readonly manufacturer?: string
  readonly defectiveNote?: string
  readonly costPackageCount: Decimal
  readonly cost: Decimal
  readonly costUnit: UnitType
  readonly tempCount: Decimal
  readonly note?: string
  readonly enable: boolean

  constructor(props: ItemProps) {
    super(props)
  }
}

export class telType extends ValueObject<string> {
  private constructor(val: string) {
    super(val)
  }
  static getInstance(val: string): telType | ValidationError {
    if (!/^[0-9]+-[0-9]+-[0-9]+$/.test(val)) {
      return new ValidationError('番号の形式が異なります。')
    }
    return new this(val)
  }
}

export const Prefectures = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県'
] as const

export class PrefectureType extends ValueObject<string> {
  private constructor(val: string) {
    super(val)
  }
  static getInstance(val: string): PrefectureType | ValidationError {
    if (Prefectures.findIndex((p) => p === val) ===-1) {
      return new ValidationError('都道府県が存在しません。')
    }
    return new this(val)
  }
}

export interface SupplierProps {
  readonly id: number
  readonly name: string
  readonly enable: boolean
  readonly furigana: furiganaType
  readonly zip?: zipType
  readonly prefecture?: PrefectureType
  readonly address?: string
  readonly tel?: telType
  readonly fax?: telType
}

export class Supplier extends Entity<SupplierProps> implements SupplierProps {
  constructor(props: SupplierProps) {
    super(props)
  }
  readonly id: number
  readonly name: string
  readonly enable: boolean
  readonly furigana: furiganaType
  readonly zip?: zipType
  readonly prefecture?: PrefectureType
  readonly address?: string
  readonly tel?: telType
  readonly fax?: telType
}

export enum Status {
  入庫 = 1,
  出庫 = 2
}

export enum 入庫理由 {
  発注 = '発注',
  仕入 = '仕入',
  返品 = '返品',
  棚卸調整 = '棚卸調整'
}

export enum 出庫理由 {
  見積 = '見積',
  受注予約 = '受注予約',
  受注出庫 = '受注出庫',
  不良品 = '不良品',
  棚卸調整 = '棚卸調整'
}
export type Reason = 入庫理由 | 出庫理由
export type ReasonType = Master & { name: Reason; status: Status }

export enum ITEM_FIELD {
  COUNT = '実在庫',
  TEMP_COUNT = '仮在庫',
  BOTH = '実在庫仮在庫',
  NONE = '引落なし'
}

export interface HistoryProps {
  readonly id: number
  readonly date: Date
  readonly itemId: Item['id']
  readonly isTemp: boolean
  readonly status: Status
  readonly reason: ReasonType
  readonly note: string
  readonly addCount: Decimal
  readonly reduceCount: Decimal
  readonly editUserId: User['id']
  readonly editUserName: User['name']
  readonly bookUserId: User['id'] | null
  readonly bookUserName: User['name'] | null
  readonly bookDate: Date | null
}

export class History extends Entity<HistoryProps> implements HistoryProps {
  readonly date: Date
  readonly status: Status
  readonly itemId: Item['id']
  readonly reason: ReasonType
  readonly note: string
  readonly addCount: Decimal
  readonly reduceCount: Decimal
  readonly isTemp: boolean = false
  readonly editUserId: number
  readonly editUserName: string
  readonly bookUserId: number | null
  readonly bookUserName: string | null
  readonly bookDate: Date | null
  private constructor(props: HistoryProps) {
    super(props)
  }
  public static getInstance(
    props: HistoryProps
  ): History | InvalidArgumentError {
        return new this({ ...props })
  }
}
