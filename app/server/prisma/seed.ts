import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { DEFAULT_USER_PASS , API_SALT} from '$/envValues'
const prisma = new PrismaClient()
// import { Units, ItemTypes, WoodSpecies} from '@domain/seeds/master'

async function seed() {
  await prisma.unit.createMany({
    data: [
      {id: 1, name: "㎥", order:1},
      {id: 2, name: "ケース", order:2},
      {id: 3, name: "枚", order: 3},
      {id: 4, name: "平米", order:4},
      {id: 5, name: "坪", order:5}
    ]
  })
  await prisma.itemType.createMany({
    data: [
      {id: 1, name: "集成材", order:1},
      {id: 2, name: "フローリング", order:2},
      {id: 3, name: "タイカライト", order: 3},
      {id: 4, name: "クラフトマンウォール", order:4},
      {id: 5, name: "不燃木材", order:5},
      {id: 6, name: "天板", order:6},
      {id: 7, name: "アメリカ古材", order:7},
      {id: 8, name: "パネリング", order:8},
      {id: 9, name: "ベニヤ", order:9}
    ]
  })

  await prisma.species.createMany({
    data: [
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
  })

  await prisma.user.createMany({
    data: [
      {id:1 , name: "森庵充久", enable: true},
      {id:41 , name: "管理者", enable: true}
    ]
  })
  

  await prisma.userPass.createMany({
    data: [
      {userId:1 , pass: bcrypt.hashSync(DEFAULT_USER_PASS, API_SALT)},
      {userId:41 , pass:  bcrypt.hashSync(DEFAULT_USER_PASS, API_SALT)}
    ]
  })
}


export default seed;