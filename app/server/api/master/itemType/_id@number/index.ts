import { ItemTypeType } from "$/domain/entity/stock";

export type Methods = {
  get: {
    resBody: ItemTypeType
  },
  post: {
    reqBody: {body: ItemTypeType},
    resBody: ItemTypeType
  },
  patch: {
    reqBody: {id: number, body: Partial<ItemTypeType>},
    resBody: ItemTypeType
  }
}
