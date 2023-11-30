import { StateCrud, StateCrudContext, StateExtend } from '../models';
import { StateManager } from './state-manager';
import { generateStateCrudFunctions } from '../models/state-crud-functions.const';
import { ArrayHelper, StringHelper } from '@alkemist/smart-tools';
import { StateCrudActionEnum } from '../models/state-crud-action.type';

export class StateCrudManager<C extends StateExtend = StateExtend, I = any, S extends StateCrud<I> = StateCrud<I>>
  extends StateManager<C, S, StateCrudContext<S, I>, I> {
  import(stateManager: StateManager) {
    this.selects = stateManager['selects'];
    this.actions = stateManager['actions'];

    ArrayHelper.recordToList(generateStateCrudFunctions())
      .forEach((crud) => {
        this.actions.set(crud.key, {
          log: StringHelper.capitalize(crud.key),
          fn: crud.value
        });
      });
  }

  dispatchFill(payload: I[]) {
    this.apply(StateCrudActionEnum.Fill, payload)
    return this;
  }

  dispatchAdd(payload: I) {
    this.apply(StateCrudActionEnum.Add, payload)
    return this;
  }

  dispatchReplace(payload: I) {
    this.apply(StateCrudActionEnum.Add, payload)
    return this;
  }

  dispatchUpdate(payload: Partial<I>) {
    this.apply(StateCrudActionEnum.Add, payload)
    return this;
  }

  dispatchRemove(payload: I) {
    this.apply(StateCrudActionEnum.Add, payload)
    return this;
  }

  dispatchReset() {
    this.apply(StateCrudActionEnum.Reset);
    return this;
  }
}
