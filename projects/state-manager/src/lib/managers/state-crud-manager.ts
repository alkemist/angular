import { StateCrud, stateCrudAdd, StateCrudContext, StateExtend } from '../models';
import { StateManager } from './state-manager';

export class StateCrudManager<C extends StateExtend = StateExtend, I = any, S extends StateCrud<I> = StateCrud<I>>
  extends StateManager<C, S, StateCrudContext<S, I>, I> {
  import(stateManager: StateManager) {
    this.selects = stateManager['selects'];
    this.actions = stateManager['actions'];

    this.actions.set('add', {
      log: 'Add',
      fn: stateCrudAdd
    });
  }
}
