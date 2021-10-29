import { UnitType, ItemTypeType, WoodSpeciesType, 出庫理由, ReasonType, Status, 入庫理由 } from "../entity/stock"

///在庫理由
export const StockReason: ReasonType[] = [
  //入庫
  {id: 1,  name: 入庫理由.仕入,  status:  Status.入庫, order: 1},   
  {id: 2,  name: 入庫理由.返品,  status:  Status.入庫,order: 2},   
  {id: 3,  name: 入庫理由.棚卸調整,  status:  Status.入庫,order: 3},   
  //出庫
  {id: 4,  name: 出庫理由.見積,  status:  Status.出庫,order: 4},   
  {id: 5,  name: 出庫理由.受注予約,  status:  Status.出庫,order: 5},   
  {id: 6,  name: 出庫理由.受注出庫,  status:  Status.出庫,order: 6},   
  {id: 7,  name: 出庫理由.不良品,  status:  Status.出庫,order: 7},   
  {id: 8,  name: 出庫理由.棚卸調整,  status:  Status.出庫,order: 8},   
]

///単位
export const Units:UnitType[] = [
  {id: 1, name: "㎥", order:1},
  {id: 2, name: "ケース", order:2},
  {id: 3, name: "枚", order: 3},
  {id: 4, name: "平米", order:4},
  {id: 5, name: "坪", order:5}
]

///材種
export const ItemTypes:ItemTypeType[] =  [
  {id: 1, name: "集成材", order:1},
  {id: 2, name: "フローリング", order:2},
  {id: 3, name: "タイカライト", order: 3},
  {id: 4, name: "クラフトマンウォール", order:4},
  {id: 5, name: "不燃木材", order:5},
  {id: 6, name: "天板", order:6},
  {id: 7, name: "アメリカ古材", order:7},
  {id: 8, name: "パネリング", order:8},
  // {id: 9, name: "ベニヤ", order:9}
]

/// 樹種
export const WoodSpecies:WoodSpeciesType[] = [
  {id: 1,  name: "桧",  order: 1},   
  {id: 2,  name: "タモ",  order: 2},   
  {id: 3,  name: "チーク",  order: 3},   
  {id: 4,  name: "イエローパイン",  order: 4},   
  {id: 5,  name: "ナラ",  order: 5},   
  {id: 6,  name: "オーク",  order: 6},   
  {id: 7,  name: "ウェスタンレッドシダー",  order: 7},   
  {id: 8,  name: "HEM",  order: 8},   
  {id: 9,  name: "ラバーウッド",  order: 9},   
  {id: 10,  name: "メルクシパイン",  order: 10},   
  {id: 11,  name: "ハードメープル",  order: 11},   
  {id: 12,  name: "ブラックチェリー",  order: 12},   
  {id: 13,  name: "カバ桜",  order: 13},   
  {id: 14,  name: "赤松",  order: 14},   
  {id: 15,  name: "ウォルナット",  order: 15},   
  {id: 16,  name: "ニレ",  order: 16},   
  {id: 17,  name: "ラジアタパイン",  order: 17},   
  {id: 18,  name: "杉",  order: 18},   
  {id: 19,  name: "タイカライト",  order: 19},   
  {id: 20,  name: "アメリカ古材",  order: 20},   
  {id: 21,  name: "杉足場板",  order: 21},   
  {id: 22,  name: "ラワン",  order: 22},   
  {id: 23,  name: "針葉樹",  order: 23}
]

