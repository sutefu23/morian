import { History } from '@prisma/client'
export type Methods = {
  get: {
    resBody: History | null
  }
  patch: {
    reqBody: { id: number; data: Partial<History> }
    resBody: History | null
  }
}
