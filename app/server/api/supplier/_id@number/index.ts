import { SupplierDTO } from "$/domain/dto/supplier";
import { Supplier } from "$/domain/entity/stock";

export type Methods = {
  get: {
    resBody: SupplierDTO|null,
  },
  post: {
    reqBody: {body: SupplierDTO},
    resBody: SupplierDTO
  }
  patch: {
    reqBody: {id: number, body: Partial<SupplierDTO>},
    resBody: SupplierDTO
  }
}
