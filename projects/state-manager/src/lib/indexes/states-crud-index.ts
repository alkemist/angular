import { StatesIndex } from './states-index';
import { StateCrudManager } from '../managers/state-crud-manager';
import { StateManager } from '../managers/state-manager';
import { StateCrud, StateCrudExtend } from '../models';
import { StateExtendClass } from '../models/state-extend-class.type';

export class StatesCrudIndex extends StatesIndex<StateCrudManager> {
  protected override states = new Map<string, StateCrudManager>();

  import(stateKey: string, stateManager: StateManager) {
    const currentState = this.getOrCreate(stateKey);

    currentState.import(stateManager);
  }

  dispatchFill<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I[],
  ) {
    this.getState(stateClass).dispatchFill(payload).update()
  }

  dispatchAdd<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I,
  ) {
    this.getState(stateClass).dispatchAdd(payload).update()
  }

  dispatchReplace<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I,
  ) {
    this.getState(stateClass).dispatchReplace(payload).update()
  }

  dispatchUpdate<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: Partial<I>,
  ) {
    this.getState(stateClass).dispatchUpdate(payload).update()
  }

  dispatchRemove<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I,
  ) {
    this.getState(stateClass).dispatchRemove(payload).update()
  }

  dispatchReset<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
  ) {
    this.getState(stateClass).dispatchReset().update()
  }

  private getState<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>
  (stateClass: StateExtendClass<C>) {
    const stateKey = stateClass.getStateKey();
    return this.getStateByKey<C, S>(stateKey);
  }
}
