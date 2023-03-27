import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export type getQuery = {
  lotNo?: string
  reasonId?: number
  fromDate?: Date
  toDate?: Date
  editUserId?: number
}

export const getHistoryList = async ({
  lotNo,
  reasonId,
  fromDate,
  toDate,
  editUserId
}: getQuery) => {
  const data = await prisma.item.findMany({
    where: {
      lotNo,
      history: {
        some: {
          reasonId,
          date: {
            gte: fromDate,
            lte: toDate
          }
        }
      }
    },
    include: {
      history: {
        where: {
          reasonId,
          date: {
            gte: fromDate,
            lte: toDate
          },
          editUserId
        },
        orderBy: [{ isTemp: 'asc' }, { date: 'asc' }]
      }
    }
  })
  return data[0]
}

export const getUserEditedHistoryList = async (editUserId: number) => {
  const toDate = new Date()
  const fromDate = new Date()
  fromDate.setDate(toDate.getDate() - 7)

  const data = await prisma.item.findMany({
    where: {
      history: {
        some: {
          date: {
            gte: fromDate,
            lte: toDate
          },
          editUserId
        }
      }
    },
    include: {
      history: {
        where: {
          date: {
            gte: fromDate,
            lte: toDate
          },
          editUserId
        },
        orderBy: { date: 'desc' }
      }
    }
  })
  return data
}
export const getAllLotId = () => {
  return prisma.item.findMany({
    select:{lotNo:true}
  })
}