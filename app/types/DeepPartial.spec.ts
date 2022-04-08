export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer UU>
    ? ReadonlyArray<DeepPartial<UU>>
    : DeepPartial<T[P]>;
};