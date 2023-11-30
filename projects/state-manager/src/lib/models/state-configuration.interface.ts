import { ValueKey, ValueRecord } from '@alkemist/smart-tools'
import { StateCrud } from './state-crud.interface';

export interface StateConfiguration<S extends ValueRecord> {
  defaults: S,
  determineArrayIndexFn?: ((paths: ValueKey[]) => ValueKey) | undefined,
  enableLocalStorage?: boolean,
  showLog?: boolean
}

export interface StateCrudConfiguration<S extends StateCrud<I>, I> extends StateConfiguration<S> {
  determineArrayIndexFn: ((paths: ValueKey[]) => ValueKey),
}
