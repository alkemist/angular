import { StatesIndex } from './states-index';
import { StateCrudManager } from '../managers/state-crud-manager';
import { StateManager } from '../managers/state-manager';
import { StateCrudData, StateCrudExtend } from '../models';
import { StateExtendClass } from '../models/state-extend-class.type';
import { UnknownCrudState } from '../models/unknown-crud-state.error';
import { StateCrudSelectEnum } from '../models/state-crud-select.type';

export class StatesCrudIndex extends StatesIndex<StateCrudManager> {
  protected override states = new Map<string, StateCrudManager>();

  init(stateKey: string, stateManager: StateManager) {
    const currentState = this.getOrCreate(stateKey);

    currentState.init(stateManager);
  }

  dispatchFill<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM[],
  ) {
    this.getState(stateClass).dispatchFill(payload).update()
  }

  dispatchAdd<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM,
  ) {
    this.getState(stateClass).dispatchAdd(payload).update()
  }

  dispatchReplace<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM,
  ) {
    this.getState(stateClass).dispatchReplace(payload).update()
  }

  dispatchUpdate<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: Partial<ITEM>,
  ) {
    this.getState(stateClass).dispatchUpdate(payload).update()
  }

  dispatchRemove<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM,
  ) {
    this.getState(stateClass).dispatchRemove(payload).update()
  }

  dispatchReset<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
  ) {
    this.getState(stateClass).dispatchReset().update()
  }

  selectAll<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>
  (stateClass: StateExtendClass<STATE>) {
    return this.getState(stateClass).select(StateCrudSelectEnum.All) as ITEM[]
  }

  selectLastUpdateDate<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>
  (stateClass: StateExtendClass<STATE>) {
    return this.getState(stateClass).select(StateCrudSelectEnum.LastUpdated) as Date | null
  }

  private getState<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>
  (stateClass: StateExtendClass<STATE>) {
    const stateKey = stateClass.getStateKey();
    const state = this.getStateByKey(stateKey);

    if (!state) {
      throw new UnknownCrudState(stateKey);
    }

    return state;
  }
}
