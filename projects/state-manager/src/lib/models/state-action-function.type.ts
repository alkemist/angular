import { ValueRecord } from '@alkemist/smart-tools';
import { StateContext } from './state-context';

export type StateActionFunction<S extends ValueRecord = any, C extends StateContext<S> = StateContext<S>>
  = (context: C, payload?: any) => void;
