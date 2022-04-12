import { getQuery } from "$/service/issue"
import { Issue, IssueItem } from "@prisma/client"
import { IssueProps } from "domain/entity/issue"


export type Methods = {
  get: {
    query: getQuery,
    resBody: (Issue & {
      issueItems: IssueItem[];
  })[]
  },
  post: {
    reqBody: IssueProps
    resBody: Issue
    status: 201
  }
}
