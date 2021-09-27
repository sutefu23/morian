import { Entity } from "@domain/type/entity"


interface UserProps {
  readonly id :number
  readonly name: string
  readonly pass: string
  readonly enable: boolean
}

export class User extends Entity<UserProps> implements UserProps{
  constructor(props: UserProps){
    super(props)
  }

  readonly id :number
  readonly name: string
  readonly pass: string
  readonly enable: boolean
}