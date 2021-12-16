import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  console.log("testdata: run!")
  await prisma.item.createMany({
    data: []
  })
  console.log("testdata: finish!")
  process.exit(0)
}

export default seed();