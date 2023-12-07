import { ValueRecord } from '@alkemist/smart-tools';

export interface StateCrudData<ITEM> extends ValueRecord {
  all: ITEM[]
  lastUpdated: Date | null;
}
