import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { DEFAULT_USER_PASS , API_SALT} from '../envValues'
const prisma = new PrismaClient()
import { Units, ItemTypes, WoodSpecies} from '../domain/init/master'

async function seed() {
  console.log("seeder: run!")

  await prisma.unit.createMany({
    data: Units
  })
  await prisma.itemType.createMany({
    data:ItemTypes
  })

  await prisma.species.createMany({
    data: WoodSpecies
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
  console.log("seeder: finish!")
  process.exit(0)
}


export default seed();