import { PrismaClient } from "@prisma/client"
import { IssueProps } from "../entity/issue";
const prisma = new PrismaClient();

export const createIssue = async (issueData: IssueProps) => {
  return await prisma.issue.create({
    data: issueData
  })
}

export const fetchIssues = async () => {
  return await prisma.issue.findMany({
    include:{
      issueItem: true
    }
  })
}

// export const exchangeStock = async (issueData: Issue ) => {
//   await prisma.item.create({
//     data : issueData
//   })
// }