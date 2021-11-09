import { ValidationError, FieldNotFoundError } from "@domain/type/error";
import { History as EntityHistory, 入庫理由, 出庫理由 } from "@domain/entity/stock";
import { History as PrismaHistory } from "$prisma/client"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dbModelToEntity = async (model: PrismaHistory): Promise<EntityHistory | FieldNotFoundError | ValidationError> => {
  const reasonData = await prisma.reason.findUnique({
    where: {
      id: model.reasonId
    }
  })
  if(!reasonData){
    return new FieldNotFoundError("reasonが見つかりません")
  }
  const reason = {
    id: reasonData.id,
    name: reasonData.name as 入庫理由 | 出庫理由,
    status: reasonData.order,
    order: reasonData.order
  }
  const user = await prisma.user.findUnique({
    where:{
      id: model.editUserId
    }
  })
  if(!user){
    return new FieldNotFoundError("ユーザーが見つかりません")
  }
  const editUserName = user.name

  const bookUserName = await (async () => {
    if(!model.bookUserId){
      return null
    }
    const bUser = await prisma.user.findUnique({
      where:{
        id: model.bookUserId
      }
    })
    if(!bUser){
      return null
    }
    return bUser.name
  }
  )()
  const history = EntityHistory.getInstance({...model, editUserName, reason, bookUserName })

  return history
}