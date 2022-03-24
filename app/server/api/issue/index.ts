import { Issue } from "@prisma/client"
import { IssueProps } from "domain/entity/issue"

export type Methods = {
  get: {
    resBody: Issue[]
  },
  post: {
    reqBody: IssueProps
    resBody: Issue
    status: 201
  }
}
