import { IssueItem } from "@prisma/client"
import { IssueItemProps } from "@domain/entity/issue"
import { getQuery } from "$/service/issueItem"

export type Methods = {
  get: {
    query: getQuery,
    resBody: IssueItem[]
  },
  patch: {
    reqBody: {
      id: number,
      data:Partial<IssueItemProps>
    }
    resBody: IssueItem
  }
}
