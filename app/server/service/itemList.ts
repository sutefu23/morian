import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type getQuery = {
  woodSpeciesId?: number,
  itemTypeId?: number,
  notZero?: boolean
}

export const getExsitItemGroupList = async () => {
  return await prisma.item.groupBy({
    by: ['itemTypeId', 'woodSpeciesId'],
  })
}


export const getItemList = async ({woodSpeciesId, itemTypeId, notZero}:getQuery) =>{
  const query = {
    where: {
      woodSpeciesId,
      itemTypeId,
    },
  }

  const extraQuery = (() => {
    if(notZero){
      return {
          where: {
          count:{
            not:0
          }
        }
      }
    }
  })()


  const data = await prisma.item.findMany({...query,...extraQuery})
  return data
}