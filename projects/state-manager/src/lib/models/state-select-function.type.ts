import { AnyValue, ValueRecord } from '@alkemist/smart-tools';

export type StateSelectFunction<S extends ValueRecord = any, T = AnyValue>
  = (state: S) => T;