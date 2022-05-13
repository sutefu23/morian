import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type getQuery = {
  lotNo: string,
}

export const getHistoryList = async ({ lotNo }:getQuery) =>{
  const data = await prisma.item.findMany({
    where: {lotNo},
    include:{
      history:{
        orderBy:[
          {isTemp:'asc'},
          {date:'asc'},
        ]
      }
    },
  })
  return data[0]
}