import { PrismaClient } from "@prisma/client"
import { IssueItemProps } from "../domain/entity/issue";
const prisma = new PrismaClient()

export const updateIssueItem = async (id:number, issueItemData: Partial<IssueItemProps>) => {
  const data = await prisma.issueItem.update({
    where:{id},
    data: {
      ...issueItemData
    }}
  )
  return data
}
