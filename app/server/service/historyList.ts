import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type getQuery = {
  lotNo?: string,
  reasonId?: number,
  isDefective?: boolean,
  fromDate?: Date,
  toDate?: Date
}

export const getHistoryList = async ({ lotNo, reasonId, fromDate, toDate}:getQuery) =>{
  const data = await prisma.item.findMany({
    where: {
      lotNo,
      history:{
        every:{
          reasonId,
          date:{
            gte: fromDate,
            lte: toDate
          }
        }
      }
    },
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

