import { ValueRecord } from '@alkemist/smart-tools';

export interface StateCrud<I> extends ValueRecord {
  all: I[]
}
