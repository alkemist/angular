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

  dispatchCrud<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    actions: 'add'[],
    payload: I,
  ) {
    const stateKey = stateClass.getStateKey();
    const states = this.getState<C, S>(stateKey);

    actions.forEach(actionKey => {
      states.apply(actionKey, payload);
    })

    states.update()
  }
}
