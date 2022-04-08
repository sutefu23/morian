import { PrismaClient } from "@prisma/client"
import { IssueProps } from "../entity/issue";
import { Item } from "../entity/stock";
const prisma = new PrismaClient();

export const createIssue = async (issueData: IssueProps) => {
  return await prisma.issue.create({
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
}

export const fetchIssues = async () => {
  return await prisma.issue.findMany({
    include:{
      issueItems: true
    }
  })
}

// export const exchangeStock = async (issueData: Issue ) => {
//   await prisma.item.create({
//     data : issueData
//   })
// }