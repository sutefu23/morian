import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const queryPrefix = async (itemTypeId: number) => {
  const itemTypes = await prisma.itemType.findMany()

  if (itemTypes.length === 0) {
    return new Error('ItemTypeデータが見つかりません')
  }
  const prefixConfig = itemTypes?.find(
    (itm) => itm.id === itemTypeId
  )?.prefix
  
  return prefixConfig
}
