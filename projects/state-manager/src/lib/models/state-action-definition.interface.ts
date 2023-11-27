import { StateActionClass } from './state-action-class.interface';

export interface StateActionDefinition<A extends Object = Object, T = any> {
  log: string;

  new(payload: T): StateActionClass<T>;
}
