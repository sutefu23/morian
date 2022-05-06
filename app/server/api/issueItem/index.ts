import { IssueItem } from "@prisma/client"
import { IssueItemProps } from "domain/entity/issue"

export type Methods = {
  patch: {
    reqBody: {
      id: number,
      data:Partial<IssueItemProps>
    }
    resBody: IssueItem
  }
}
