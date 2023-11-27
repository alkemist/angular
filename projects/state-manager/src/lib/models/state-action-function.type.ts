import { ValueRecord } from '@alkemist/smart-tools';
import { StateContext } from './state.context';

export type StateActionFunction<S extends ValueRecord = any, T = any>
  = (context: StateContext<S>, payload: T) => void;
