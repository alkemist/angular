import { ValueRecord } from '@alkemist/smart-tools';
import { StateContext } from './state-context';

export type StateActionFunction<DATA extends ValueRecord = any, CONTEXT extends StateContext<DATA> = StateContext<DATA>>
  = (context: CONTEXT, payload?: any) => void;
