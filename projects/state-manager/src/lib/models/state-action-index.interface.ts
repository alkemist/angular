import { ValueRecord } from '@alkemist/smart-tools';
import { StateActionFunction } from './state-action-function.type';

export interface StateActionIndex<S extends ValueRecord = any, T = any> {
  stateKey: string
  actionFunction: StateActionFunction<S, T>
}
