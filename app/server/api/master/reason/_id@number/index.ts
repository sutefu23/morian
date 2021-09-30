import { ReasonType } from "$/domain/entity/stock";

export type Methods = {
  get: {
    resBody: ReasonType
  },
  patch: {
    reqBody: {id: number, body: Partial<ReasonType>},
    resBody: ReasonType
  }
}
