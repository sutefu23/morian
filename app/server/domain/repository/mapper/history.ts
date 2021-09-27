import { ValidationError, FieldNotFoundError } from "@domain/type/error";
import { History as EntityHistory } from "@domain/entity/stock";
import { History as PrismaHistory } from "$prisma/client"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dbModelToEntity = async (model: PrismaHistory): Promise<EntityHistory | FieldNotFoundError | ValidationError> => {
  const reason = await prisma.reason.findUnique({
    where: {
      id: model.reasonId
    }
  })
  if(!reason){
    return new FieldNotFoundError("reasonが見つかりません")
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

  const history = EntityHistory.getInstance({...model, editUserName, reason })

  return history
}