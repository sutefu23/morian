import { PrismaClient } from '@prisma/client'
import { IssueItemProps } from '../domain/entity/issue'
const prisma = new PrismaClient()

export type getQuery = {
  id?: number
  IssueId?: number
}

export const getIssueItem = async (query: getQuery) => {
  const data = await prisma.issueItem.findMany({
    where: {
      id: query.id,
      IssueId: query.IssueId
    }
  })
  return data
}

export const updateIssueItem = async (
  id: number,
  issueItemData: Partial<IssueItemProps>
) => {
  const data = await prisma.issueItem.update({
    where: { id },
    data: {
      ...issueItemData
    }
  })
  return data
}
