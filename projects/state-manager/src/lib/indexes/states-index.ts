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

export class StatesIndex<M extends StateManager = StateManager, STATE extends ValueRecord = any, CONTEXT extends StateContext<STATE> = any> {
  protected states = new Map<string, M>();

  constructor(
    private stateManagerFactory: Type<M>,
    private stateContextFactory: Type<CONTEXT>
  ) {
  }

  registerSelect<C extends StateExtend, S extends ValueRecord, T>(
    stateClass: StateExtendClass<C>,
    selectKey: string,
    selectFunction: StateSelectFunction<S, T>,
    path?: ValueKey | ValueKey[]
  ) {
    const stateKey = stateClass.getStateKey();
    let map = this.getOrCreate<C, S>(stateKey);

    map.setSelect(selectKey, selectFunction, path);
  }

  registerAction<A extends Object, C extends StateExtend, CO extends StateContext<S>, S extends ValueRecord, T>(
    state: C,
    action: StateActionWithPayloadDefinition<T> | StateActionWithoutPayloadDefinition,
    actionFunction: StateActionFunction<S, CO>,
  ) {
    const stateKey = (state.constructor as StateExtendClass<C>).getStateKey();
    let map = this.getOrCreate<C, S>(stateKey);

    map.setAction(action, actionFunction as StateActionFunction);
  }

  registerObserver<C extends StateExtend, S extends ValueRecord, T>(
    stateClass: StateExtendClass<C>,
    selectKey: string,
    observerKey: string,
    observer: WritableSignal<T>
  ) {
    const stateKey = stateClass.getStateKey();
    let map = this.getOrCreate<C, S>(stateKey);

    map.setObserver(stateKey, selectKey, observerKey, observer);
  }

  registerState<C extends StateExtend, S extends ValueRecord>(
    stateClass: StateExtendClass<C>,
    configuration: StateConfiguration<S>
  ) {
    const stateKey = stateClass.getStateKey();
    let map = this.getOrCreate<C, S>(stateKey);

    map.initContext(stateKey, configuration);
  }

  getStateByKey<C extends StateExtend, S extends ValueRecord>(stateKey: string) {
    return this.states.get(stateKey) as M;
  }

  dispatch<C extends StateExtend, S extends ValueRecord>(
    stateClass: StateExtendClass<C>,
    actions: StateActionClass[]
  ) {
    //const stateKeysToUpdate: string[] = [];
    const stateKey = stateClass.getStateKey();
    const state = this.getStateByKey<C, S>(stateKey);

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

  protected getOrCreate<C extends StateExtend, S extends ValueRecord>(stateKey: string) {
    if (this.hasState(stateKey)) {
      return this.getStateByKey<C, S>(stateKey)
    }

    const state = new this.stateManagerFactory(this.stateContextFactory);
    this.states.set(stateKey, state);

    return state
  }
}
