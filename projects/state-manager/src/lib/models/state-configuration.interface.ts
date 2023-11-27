import { ValueKey, ValueRecord } from '@alkemist/smart-tools'
import { Type } from '@angular/core';

export interface StateConfiguration<C extends Object, S extends ValueRecord> {
  name: string,
  class: Type<C>,
  defaults: S,
  determineArrayIndexFn?: ((paths: ValueKey[]) => ValueKey) | undefined,
  enableLocalStorage?: boolean,
  showLog?: boolean
}