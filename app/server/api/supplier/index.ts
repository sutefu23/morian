import { Supplier } from "$/domain/entity/stock";

export type Methods = {
  get: {
    query?: {
      enable?:boolean,
      name?:string
    },
    resBody: Supplier[]
  }
}
