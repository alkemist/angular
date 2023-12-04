import { ValueKey, ValueRecord } from '@alkemist/smart-tools'
import { StateCrudData } from './state-crud-data.interface';

export interface StateConfiguration<DATA extends ValueRecord> {
  defaults: DATA,
  determineArrayIndexFn?: ((paths: ValueKey[]) => ValueKey) | undefined,
  enableLocalStorage?: boolean,
  showLog?: boolean
}

export interface StateCrudConfiguration<DATA extends StateCrudData<ITEM>, ITEM>
  extends StateConfiguration<DATA> {
  determineArrayIndexFn: ((paths: ValueKey[]) => ValueKey),
}
