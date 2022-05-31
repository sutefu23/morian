import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type getQuery = {
  woodSpeciesId?: number,
  itemTypeId?: number,
  isDefective?: boolean
  notZero?: boolean
}

export const getExsitItemGroupList = async () => {
  return await prisma.item.groupBy({
    by: ['itemTypeId', 'woodSpeciesId'],
  })
}


export const getItemList = async ({woodSpeciesId, itemTypeId, notZero, isDefective}:getQuery) =>{
  const query = {
    where: {
      woodSpeciesId,
      itemTypeId,
    },
  }

  const notZeroQuery = (() => {
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

  const isDefectiveQuery = (() => {
    if(isDefective){
      return {
          where: {
            OR:[
              {
                defectiveNote:{
                  not:null
                }
              },
              {
                defectiveNote:{
                  not:""
                }
              }

            ]
        }
      }
    }
  })()

  const data = await prisma.item.findMany({...query,...notZeroQuery,...isDefectiveQuery})
  return data
}