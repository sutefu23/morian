import { PrismaClient, Issue } from '@prisma/client'
import { IssueProps } from '../domain/entity/issue'
import dayjs from 'dayjs'
const prisma = new PrismaClient()

export type getQuery = {
  id?: number
  isStored?: boolean
  supplierId?: number
  fromDate?: Date
  toDate?: Date
}

export const createIssue = async (issueData: IssueProps) => {
  const maxIssue = await prisma.issue.aggregate({
    _max: {
      managedId: true
    },
    where: {
      managedId: {
        startsWith:
          dayjs().format('YYMMDD') +
          '-' +
          ('000' + issueData.userId).slice(-3) +
          '-'
      }
    }
  })
  const newManagedId = (() => {
    const maxManagedId = maxIssue._max.managedId
    const split = maxManagedId?.split('-')
    const daySerial = (() => {
      //日付毎の連番
      if (!maxManagedId) return 0
      if (!split) return 0
      return Number(split[split?.length - 1])
    })()
    return `${dayjs().format('YYMMDD')}-${('000' + issueData.userId).slice(
      -3
    )}-${daySerial + 1}`
  })()

  const findManagedId = await prisma.issue.findFirst({
    where: {
      managedId: newManagedId
    }
  })

  if (findManagedId) {
    return new Error('管理IDが既に存在します。')
  }

  const data = await prisma.issue.create({
    data: {
      ...issueData,
      managedId: newManagedId,
      date: new Date(issueData.date),
      issueItems: {
        createMany: {
          data: issueData.issueItems
        }
      }
    }
  })
  return data
}

export const updateIssue = async (id: number, issueData: IssueProps) => {
  const data = await prisma.$transaction<Issue>(async (prisma) => {
    const updateItems = await Promise.all(
      issueData.issueItems.map(async (item) => {
        return await prisma.issueItem.update({
          where: { id: item.id },
          data: {
            ...item
          }
        })
      })
    )
    const updateIssue = await prisma.issue.update({
      where: {
        id
      },
      data: {
        ...issueData,
        issueItems: undefined
      }
    })
    return {
      ...updateIssue,
      issueItems: updateItems
    }
  })

  return data
}

export const fetchIssues = async (query: getQuery) => {
  const { id, isStored, supplierId, fromDate, toDate } = query
  const data = await prisma.issue.findMany({
    where: {
      id,
      supplierId,
      date: {
        gte: fromDate,
        lte: toDate
      },
      issueItems: {
        some: {
          isStored
        }
      }
    },
    include: {
      issueItems: {
        where: {
          isStored
        }
      }
    }
  })

  return data
}

export const deleteIssue = async (id: number) => {
  await prisma.issue.delete({
    where: { id },
    include: {
      issueItems: true
    }
  })
}
