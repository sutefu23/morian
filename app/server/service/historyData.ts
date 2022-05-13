import { History, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getHistory = async (id:number) =>{
  const data = await prisma.history.findUnique({
    where: {id},
  })
  return data
}

export const updateHistory = async (id:number, historyData: Partial<History>) => {
  const data = await prisma.history.update({
    where:{id},
    data: {
      ...historyData,
    }}
  )
  return data
}