import { PrismaClient } from "@prisma/client"
import { IssueProps } from "../domain/entity/issue";
const prisma = new PrismaClient();

export type getQuery = {
  id?: number
  isStored?: boolean,
}

export const createIssue = async (issueData: IssueProps) => {
  const data = await prisma.issue.create({
    data: {
      ...issueData,
      date: new Date(issueData.date),
      issueItems: {
        createMany: {
          data: issueData.issueItems
        }
      },
    }
  })
  return data
}

export const fetchIssues = async (query:getQuery) => {
  const data = await prisma.issue.findMany({
    where: {id: query?.id},
    include:{
      issueItems:  {
        where: {
          isStored: query?.isStored,
        },
      },
    }
  })
  return data
}