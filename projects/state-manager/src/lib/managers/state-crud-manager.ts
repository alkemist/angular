import { StateCrudContext, StateCrudData } from '../models';
import { StateManager } from './state-manager';
import { generateStateCrudActions } from '../models/state-crud-actions.const';
import { ArrayHelper, StringHelper } from '@alkemist/smart-tools';
import { StateCrudActionEnum } from '../models/state-crud-action.type';
import { StateSelect } from '../models/state-select';
import { generateStateCrudSelects } from '../models/state-crud-selects.const';

export class StateCrudManager<
  ITEM = any,
  DATA extends StateCrudData<ITEM> = StateCrudData<ITEM>
>
  extends StateManager<ITEM, DATA, StateCrudContext<DATA, ITEM>> {
  init(stateManager: StateManager) {
    if (stateManager) {
      this.selects = stateManager['selects'];
      this.actions = stateManager['actions'];
    }

    ArrayHelper.recordToList(generateStateCrudActions())
      .forEach((crud) => {
        this.actions.set(crud.key, {
          log: StringHelper.capitalize(crud.key),
          fn: crud.value
        });
      });

    ArrayHelper.recordToList(generateStateCrudSelects())
      .forEach((crud) => {
        this.selects.set(crud.key,
          new StateSelect(crud.value, crud.key)
        );
      });
  }

  dispatchFill(payload: ITEM[]) {
    this.apply(StateCrudActionEnum.Fill, payload)
    return this;
  }

  dispatchAdd(payload: ITEM) {
    this.apply(StateCrudActionEnum.Add, payload)
    return this;
  }

  dispatchReplace(payload: ITEM) {
    this.apply(StateCrudActionEnum.Replace, payload)
    return this;
  }

  dispatchUpdate(payload: Partial<ITEM>) {
    this.apply(StateCrudActionEnum.Update, payload)
    return this;
  }

  dispatchRemove(payload: ITEM) {
    this.apply(StateCrudActionEnum.Remove, payload)
    return this;
  }

  dispatchReset() {
    this.apply(StateCrudActionEnum.Reset);
    return this;
  }
}
