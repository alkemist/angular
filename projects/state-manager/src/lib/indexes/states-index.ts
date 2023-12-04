import { StateManager } from '../managers/state-manager';
import { StateContext, StateExtend } from '../models';
import { ValueKey, ValueRecord } from '@alkemist/smart-tools';
import { StateExtendClass } from '../models/state-extend-class.type';
import { StateSelectFunction } from '../models/state-select-function.type';
import {
  StateActionWithoutPayloadDefinition,
  StateActionWithPayloadDefinition
} from '../models/state-action-definition.interface';
import { StateActionFunction } from '../models/state-action-function.type';
import { Type, WritableSignal } from '@angular/core';
import { StateConfiguration } from '../models/state-configuration.interface';
import { StateActionClass } from '../models/state-action-class.interface';

export class StatesIndex<
  MANAGER extends StateManager = StateManager,
  DATA extends ValueRecord = any,
  CONTEXT extends StateContext<DATA> = any
> {
  protected states = new Map<string, MANAGER>();

  constructor(
    private stateManagerFactory: Type<MANAGER>,
    private stateContextFactory: Type<CONTEXT>
  ) {
  }

  registerSelect<STATE extends StateExtend, DATA extends ValueRecord, ITEM>(
    stateClass: StateExtendClass<STATE>,
    selectKey: string,
    selectFunction: StateSelectFunction<DATA, ITEM>,
    path?: ValueKey | ValueKey[]
  ) {
    const stateKey = stateClass.getStateKey();
    let map = this.getOrCreate<STATE, DATA>(stateKey);

    map.setSelect(selectKey, selectFunction, path);
  }

  registerAction<STATE extends StateExtend, CONTEXT extends StateContext<DATA>, DATA extends ValueRecord, T>(
    state: STATE,
    action: StateActionWithPayloadDefinition<T> | StateActionWithoutPayloadDefinition,
    actionFunction: StateActionFunction<DATA, CONTEXT>,
  ) {
    const stateKey = (state.constructor as StateExtendClass<STATE>).getStateKey();
    let map = this.getOrCreate<STATE, DATA>(stateKey);

    map.setAction(action, actionFunction as StateActionFunction);
  }

  registerObserver<STATE extends StateExtend, DATA extends ValueRecord, ITEM>(
    stateClass: StateExtendClass<STATE>,
    selectKey: string,
    observerKey: string,
    observer: WritableSignal<ITEM>
  ) {
    const stateKey = stateClass.getStateKey();
    let map = this.getOrCreate<STATE, DATA>(stateKey);

    map.setObserver(stateKey, selectKey, observerKey, observer);
  }

  registerState<STATE extends StateExtend, DATA extends ValueRecord>(
    stateClass: StateExtendClass<STATE>,
    configuration: StateConfiguration<DATA>
  ) {
    const stateKey = stateClass.getStateKey();
    let map = this.getOrCreate<STATE, DATA>(stateKey);

    map.initContext(stateKey, configuration);
  }

  getStateByKey(stateKey: string) {
    return this.states.get(stateKey) as MANAGER;
  }

  dispatch<STATE extends StateExtend, DATA extends ValueRecord>(
    stateClass: StateExtendClass<STATE>,
    actions: StateActionClass[]
  ) {
    //const stateKeysToUpdate: string[] = [];
    const stateKey = stateClass.getStateKey();
    const state = this.getStateByKey(stateKey);

    /*actions.forEach(action => {
      const actionKey = action.constructor.name;
      const stateAction = StatesMap

      if (!stateAction) {
        throw new UnknownAction(actionKey)
      }

      StatesMap.getEventsIndex(stateAction.stateKey)
        .apply(actionKey, stateAction.actionFunction, action.payload);

      if (stateKeysToUpdate.indexOf(stateAction.stateKey) === -1) {
        stateKeysToUpdate.push(stateAction.stateKey)
      }
    })*/

    actions.forEach(action => {
      const actionKey = action.constructor.name;
      state.apply(actionKey, action.payload);
    })

    state.update()
  }

  hasState(stateKey: string) {
    return this.states.has(stateKey);
  }

  removeState(stateKey: string) {
    this.states.delete(stateKey);
  }

  protected getOrCreate<STATE extends StateExtend, DATA extends ValueRecord>
  (stateKey: string) {
    if (this.hasState(stateKey)) {
      return this.getStateByKey(stateKey)
    }

    const state = new this.stateManagerFactory(this.stateContextFactory);
    this.states.set(stateKey, state);

    return state
  }
}
