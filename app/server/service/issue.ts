import { PrismaClient } from "@prisma/client"
import { IssueProps } from "../domain/entity/issue";
const prisma = new PrismaClient();

export type getQuery = {
  id?: number
  isStored?: boolean,
}

export const createIssue = async (issueData: IssueProps) => {
  const findManagedId = await prisma.issue.findFirst({where:{
    managedId: issueData.managedId
  }})

  if(findManagedId){
    return new Error("管理IDが既に存在します。")
  }

  const findLotNo = await prisma.item.findFirst({where:{
    lotNo: issueData.managedId
  }})

  if(findLotNo){
    return new Error("ロットNoが既に存在します。")
  }

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

export const deleteIssue = async (id: number) => {
  await prisma.issue.delete({
    where: {id},
    include:{
      issueItems:true
    }
  })
} 