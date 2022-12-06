import { SupplierDTO } from '$/domain/dto/supplier'

export type Methods = {
  get: {
    query?: {
      enable?: boolean
      name?: string
    }
    resBody: SupplierDTO[]
  }
}
