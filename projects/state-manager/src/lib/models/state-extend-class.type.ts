import { StateExtend } from './state-extend';

export type StateExtendClass<T extends StateExtend> = {
  new(): T
  getStateKey(): string;
}
