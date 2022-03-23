import { User } from './user'
import { Entity } from '../type/entity'

export interface IssueProps {
  readonly id: number
  readonly managedId: string
  readonly date: Date
  readonly issueUserId: User['id']
  readonly issueUserName: User['name']
}

export class Issue extends Entity<IssueProps> implements IssueProps {
  readonly managedId: string
  readonly date: Date
  readonly issueUserId: number
  readonly issueUserName: string
  private constructor(props: IssueProps) {
    super(props)
  }
}
