import { AnyValue, ValueRecord } from '@alkemist/smart-tools';

export type StateSelectFunction<DATA extends ValueRecord = any, ITEM = AnyValue>
  = (state: DATA) => unknown;
