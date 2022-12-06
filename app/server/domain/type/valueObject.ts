import { shallowEqual } from 'shallow-equal-object'

export abstract class AbstractValueObject<T> {
  protected _value: T

  protected constructor(_value: T) {
    this._value = Object.freeze(_value)
  }

  get value(): T {
    return this._value
  }

  equals(vo?: AbstractValueObject<T>): boolean {
    if (vo == null) {
      return false
    }
    return shallowEqual(this._value, vo._value)
  }
}

interface ValueObjectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export abstract class ValueObject<
  T extends ValueObjectProps | number | string
> extends AbstractValueObject<T> {}
