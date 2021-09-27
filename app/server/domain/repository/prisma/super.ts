import { PrismaClient } from '@prisma/client'

export class PrismaRepository{
  readonly prisma :PrismaClient

  constructor(){
    this.prisma = new PrismaClient()
  }
}