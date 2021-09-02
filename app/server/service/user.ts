import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { User } from '$prisma/client'
import { API_SALT } from '$/service/envValues'
const prisma = new PrismaClient()


export const getUserInfo = async (id: number) => 
  await prisma.user.findUnique({ where: { id } })


export const validateUser = async (id: number, pass: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      UserPass: true,
    },
  })
  return await bcrypt.compare(pass, user?.UserPass?.pass || '')
}

export const getUserInfoById = async (id: User['id']) => await ({ id, ...getUserInfo(id) })

export const createUser = async (id: User['id'], name: string, pass: string) => {
  return await prisma.user.create({
    data:{
      id,
      name,
      UserPass: {
        create: {
          pass: bcrypt.hashSync(pass, API_SALT)
        }
      }
    }
  })
}

export const modifyPassword = async (id:User['id'], pass: string) => {
  await prisma.userPass.update({
    where:{ id },
    data: { pass: bcrypt.hashSync(pass, API_SALT) }
  })
}