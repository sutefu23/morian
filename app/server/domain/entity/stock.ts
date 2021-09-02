import { ValueObject } from "$/domain/type/valueObject"
import { Entity } from "$/domain/type/entity"

export class ロット番号型 extends ValueObject<string>{
  private constructor(val: string){ super(val) }

  static getInstance(val: string):ロット番号型 | never{
    if(!/^[A-Z]+-([0-9]|-)+$/gu.test(val)){
      throw new Error("ロット番号の形式が正しくありません。英語-数字")
    }
    return new this(val)
  }
}

interface Master {
  readonly id :number
  readonly name: string
  readonly order: number 
}

export type 材種型 = Master 
export type 単位型 = Master 
export type 樹種型 = Master 
export type 倉庫型 = Master 
export type グレード型 = Master 

export type 仕様型 = string

export class フリガナ型 extends ValueObject<string>{
  private constructor(val: string){ super(val) }

  static getInstance(val: string):フリガナ型 | never{
    if(!/^[ァ-ヴー]+$/gu.test(val)){
      throw new Error("フリガナの形式が正しくありません。")
    }
    return new this(val)
  }
}

export class 郵便番号型 extends ValueObject<string>{
  private constructor(val: string){ super(val) }

  static getInstance(val: string):郵便番号型 | never{
    if(!/^[0-9]{3}-[0-9]{4}$/gu.test(val)){
      throw new Error("郵便番号の形式が正しくありません。")
    }
    return new this(val)
  }
}


export class 原価単位数量型 extends ValueObject<number>{
  private constructor(val: number){ super(val) }
  static getInstance(val: number):原価単位数量型 | never{
    if(val < 0){
      throw new Error("原価単位数量はマイナス値に出来ません。")
    }
    return new this(val)
  }
}

interface ItemProps {
  readonly id :number
  readonly name: string
  readonly enable: boolean
  readonly ロット番号: ロット番号型
  readonly 材種: 材種型
  readonly 樹種: 樹種型
  readonly グレード:グレード型
  readonly 仕様: 仕様型
  readonly 長さ?: number|"乱尺"
  readonly 厚み?: number
  readonly 幅: number
  readonly 製造元: 製造元型
  readonly 入数: number 
  readonly 原価単位数量: number
  readonly 残数: number
  readonly 仮残数 : number
}

export class 商品型 extends Entity<ItemProps>{
  constructor(props: ItemProps){
    super(props)
  }
}

export class 電話番号型 extends ValueObject<string>{
  private constructor(val: string){ super(val) }
  static getInstance(val: string):電話番号型 | never{
    if(!/^[0-9]+-[0-9]+-[0-9]+$/.test(val)){
      throw new Error("番号の形式が異なります。")
    }
    return new this(val)
  }
}

export type 都道府県型 = "北海道"|"青森県"|"岩手県"|"宮城県"|"秋田県"|"山形県"|"福島県"|"茨城県"|"栃木県"|"群馬県"|"埼玉県"|"千葉県"|"東京都"|"神奈川県"|"新潟県"|"富山県"|"石川県"|"福井県"|"山梨県"|"長野県"|"岐阜県"|"静岡県"|"愛知県"|"三重県"|"滋賀県"|"京都府"|"大阪府"|"兵庫県"|"奈良県"|"和歌山県"|"鳥取県"|"島根県"|"岡山県"|"広島県"|"山口県"|"徳島県"|"香川県"|"愛媛県"|"高知県"|"福岡県"|"佐賀県"|"長崎県"|"熊本県"|"大分県"|"宮崎県"|"鹿児島県"|"沖縄県"

export interface MakerProps {
  readonly id :number
  readonly name: string
  readonly enable: boolean
  readonly フリガナ	:フリガナ型,
  readonly 郵便番号	:郵便番号型,
  readonly 都道府県	:都道府県型,
  readonly 住所	:string,
  readonly TEL	:電話番号型,
  readonly FAX	:電話番号型,
  readonly 備考	:string,
}

export class 製造元型 extends Entity<MakerProps>{}

// export interface History{
//   readonly id : number
//   readonly note: string
//   readonly reason:
// }

// export class 在庫履歴型 extends Entity<>{
//   入出庫日
//   理由
//   予約
//   備考
//   数量,
//   単位,
//   残,
//   仮在庫数,
//   登録者

// }

export interface UserProps {
  readonly id :number
  readonly name: string
  readonly enable: boolean
  readonly pass: string
}

export class ユーザー型 extends Entity<UserProps>{}
