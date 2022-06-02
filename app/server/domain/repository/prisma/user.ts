import { PrismaClient } from "@prisma/client"
import { User, UserProps } from "@domain/entity/user"
import { IUserRepository } from "../interface"
import { FieldNotFoundError } from "$/domain/type/error"

const prisma = new PrismaClient()

export class UserRepository implements IUserRepository {
  async create(entity: UserProps): Promise<User|FieldNotFoundError> {
    const result = await prisma.user.create(
      {include:{
        UserPass: true
      },
      data: {
        id: entity.id, name: entity.name, enable:entity.enable,
        UserPass : {
          create:{
            pass: entity.pass
          }
        }
      }}
    )

    if(!result?.id || !result?.name || !result?.enable || !result.UserPass?.pass){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      pass: "",
      enable: result.enable
    }
    return data
  }

  async update(id: number, entity: Partial<UserProps>): Promise<User|FieldNotFoundError> {
    const result = await prisma.user.update(
      {where: {id}, data:{name: entity.name, enable:entity.enable}}
    )
    const resultPass = await (async () => {
      if (Object.prototype.hasOwnProperty.call(entity, "pass") && entity.pass){
        return await prisma.userPass.update(
          {where: {userId: id}, data: { pass: entity.pass}}
        )
      }
    })()
    if(!result?.id || !result?.name || !result?.enable || !resultPass?.pass){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      pass: "",
      enable: result.enable
    }
    return data
  }

  async findById(id: number): Promise<User|FieldNotFoundError> {
    const result = await prisma.user.findUnique({
      include:{
        UserPass: true
      },
      where: {
        id
      }
    })
    if(!result?.id || !result?.name || !result?.enable || !result.UserPass?.pass){
      return new FieldNotFoundError("データが見つかりません")
    }
    const data = {
      id: result.id,
      name: result.name,
      pass: result.UserPass.pass,
      enable: result.enable
    }
    return data
  }

  async findAll(enable?:boolean):Promise<User[]|FieldNotFoundError>{
    const where = (()=>{
      if(enable){
        return {
          where: {
            enable
          }
        }
      }
    })()
    const result = await prisma.user.findMany(
      {
        include:{
          UserPass: true
        },
        ...where
      }
    )
    if(!result){
      return new FieldNotFoundError("データが見つかりません")
    }
    const users = result.map(u => ({id: u.id, name: u.name, pass: "", enable: u.enable}))
    return users
  }
}