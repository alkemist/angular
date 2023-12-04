import { ValueRecord } from '@alkemist/smart-tools';

export interface StateCrudData<I> extends ValueRecord {
  all: I[]
  lastUpdated: Date | null;
}
