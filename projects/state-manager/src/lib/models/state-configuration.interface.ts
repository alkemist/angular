import { ValueKey } from '@alkemist/smart-tools'

export interface StateConfiguration<S> {
  defaults: S,
  determineArrayIndexFn?: ((paths: ValueKey[]) => ValueKey) | undefined,
  enableLocalStorage?: boolean,
  showLog?: boolean
}
