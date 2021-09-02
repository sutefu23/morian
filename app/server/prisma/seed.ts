import {  PrismaClient } from '@prisma/client'
import { Units, ItemTypes, WoodSpecies} from '@domain/seeds/master'
const prisma = new PrismaClient()

async function seed() {
  await prisma.unit.createMany({
    data: Units
  })
  await prisma.itemType.createMany({
    data: ItemTypes
  })

  await prisma.species.createMany({
    data: WoodSpecies
  })
  

}


export default seed;