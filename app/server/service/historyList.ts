import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

export type getQuery = {
  lotNo?: string
  reasonId?: number
  fromDate?: Date
  toDate?: Date
  editUserId?: number
}

export const getHistoryList = async ({ lotNo, reasonId, fromDate, toDate, editUserId }: getQuery) => {
  const data = await prisma.item.findMany({
    where: {
      lotNo,
      history: {
        some: {
          reasonId,
          date: {
            gte: fromDate ? dayjs(fromDate).toISOString() : undefined,
            lte: toDate ? dayjs(toDate).toISOString() : undefined
          }
        }
      }
    },
    include: {
      history: {
        where: {
          reasonId,
          date: {
            gte: fromDate ? dayjs(fromDate).toISOString() : undefined,
            lte: toDate ? dayjs(toDate).toISOString() : undefined
          },
          editUserId
        },
        orderBy: [{ isTemp: 'asc' }, { date: 'asc' }]
      }
    }
  })
  return data
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
            gte: fromDate ? dayjs(fromDate).toISOString() : undefined,
            lte: toDate ? dayjs(toDate).toISOString() : undefined
          },
          editUserId
        }
      }
    },
    include: {
      history: {
        where: {
          date: {
            gte: fromDate ? dayjs(fromDate).toISOString() : undefined,
            lte: toDate ? dayjs(toDate).toISOString() : undefined
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
    select: { lotNo: true }
  })
}
