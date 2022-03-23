import { PrismaClient } from "@prisma/client"
import { Issue } from "../entity/issue";
const prismaClient = new PrismaClient();

const createIssue = (issueData: Issue) => {
  prismaClient.issue.create({
    data: issueData
  })
}
