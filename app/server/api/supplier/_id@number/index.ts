import { SupplierDTO } from '$/domain/dto/supplier'

export type Methods = {
  get: {
    resBody: SupplierDTO | null
  }
  post: {
    reqBody: { body: SupplierDTO }
    resBody: SupplierDTO
  }
  patch: {
    reqBody: { id: number; body: Partial<SupplierDTO> }
    resBody: SupplierDTO
  }
}
