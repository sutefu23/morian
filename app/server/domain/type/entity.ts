export abstract class EntityProps{
  readonly id: number;
  readonly name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  readonly enable: boolean;
  protected constructor(props: EntityProps){
    this.id = props.id
    this.enable = props.enable
    this.name = props.name
  }
}

export class Entity<T extends EntityProps> extends EntityProps{
  constructor(props: EntityProps){
    super(props)
  }

  protected equals(other: Entity<T>):boolean {
    return other.id === this.id
  }
}