import { ValueKey } from "@alkemist/smart-tools";
import { CompareEngine } from '@alkemist/compare-engine';
import { StateCrudData } from './state-crud-data.interface';
import { StateContext } from './state-context';

export class StateCrudContext<STATE extends StateCrudData<ITEM>, ITEM> extends StateContext<STATE, ITEM> {
  constructor(stateKey: string, state: CompareEngine<STATE>, determineArrayIndexFn?: ((paths: ValueKey[]) => ValueKey | ValueKey[])) {
    super(stateKey, state, determineArrayIndexFn);
  }
}
