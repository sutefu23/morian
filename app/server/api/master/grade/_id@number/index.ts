import { GradeType } from '$/domain/entity/stock'

export type Methods = {
  get: {
    resBody: GradeType
  }
  post: {
    reqBody: { body: GradeType }
    resBody: GradeType
  }
  patch: {
    reqBody: { id: number; body: Partial<GradeType> }
    resBody: GradeType
  }
}
