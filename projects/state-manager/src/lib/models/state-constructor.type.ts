export type StateConstructor<T> = {
  new(): T
  stateKey: string;
}
