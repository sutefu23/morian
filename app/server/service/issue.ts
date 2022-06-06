import { PrismaClient, Issue } from "@prisma/client"
import { IssueProps, IssueItemProps } from "../domain/entity/issue";
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

export const updateIssue = async (id: number, issueData: IssueProps) => {

  const data = await prisma.$transaction<Issue>(async (prisma) => {
    const updateItems = await Promise.all(issueData.issueItems.map(async (item)=> {
      return await prisma.issueItem.update({
        where:{id:item.id},
        data: {
          ...item
        }}
      )
    }))
    const updateIssue = await prisma.issue.update({
      where:{
        id
      },
      data: {
        ...issueData,
        issueItems:undefined
      }
    })
    return {
      ...updateIssue,
      issueItems:updateItems
    }
  })
  
  return data
}

export const fetchIssues = async (query:getQuery) => {

  const data = await prisma.issue.findMany({
    where: {
      id: query?.id,
      issueItems: {
        some:{
          isStored:false
        }
      }
    },
    include:{
      issueItems: {
        where:{
          isStored: false
        }
      }
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