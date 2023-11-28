import { StateActionClass } from './state-action-class.interface';

export interface StateActionWithPayloadDefinition<T = any> {
  log: string;

  new(payload: T): StateActionClass<T>;
}

export interface StateActionWithoutPayloadDefinition {
  log: string;

  new(): {};
}
