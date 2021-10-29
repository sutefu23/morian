import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { DEFAULT_USER_PASS , API_SALT} from '../envValues'
const prisma = new PrismaClient()
import { StockReason} from '../domain/init/master'

//追加seeder
async function seed() {
  console.log("seeder: run!")

  await prisma.reason.createMany({
    data: StockReason
  })
  
  console.log("seeder: finish!")
  process.exit(0)
}


export default seed();