export abstract class EntityProps{
  readonly id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  protected constructor(props: EntityProps){
    Object.assign(this, props);
  }
  protected equals?: (other: Entity<any>) => boolean
}


export class Entity<T extends EntityProps> extends EntityProps{
  constructor(props: T){
    super(props)
  }

  protected equals? = (other: Entity<T>):boolean => {
    return other.id === this.id
  }
}