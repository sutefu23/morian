import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type getQuery = {
  woodSpeciesId: number,
  itemTypeId: number
}

export const getExsitItemGroupList = async () => {
  return await prisma.item.groupBy({
    by: ['itemTypeId', 'woodSpeciesId'],
  })

}

export const getItemList = async ({woodSpeciesId, itemTypeId}:getQuery) =>{
  const data = await prisma.item.findMany({
    where: {
      woodSpeciesId,
      itemTypeId
    },
  })
  return data
}