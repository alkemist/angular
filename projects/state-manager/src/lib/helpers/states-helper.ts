import { StateManager } from "../managers/state-manager";
import { StatesIndex } from '../indexes/states-index';
import { StateCrudManager } from '../managers/state-crud-manager';
import { StateContext, StateCrud, StateCrudContext, StateCrudExtend, StateExtend } from '../models';
import { ValueKey, ValueRecord } from '@alkemist/smart-tools';
import { StateExtendClass } from '../models/state-extend-class.type';
import { StateSelectFunction } from '../models/state-select-function.type';
import {
  StateActionWithoutPayloadDefinition,
  StateActionWithPayloadDefinition
} from '../models/state-action-definition.interface';
import { StateActionFunction } from '../models/state-action-function.type';
import { WritableSignal } from '@angular/core';
import { StateConfiguration, StateCrudConfiguration } from '../models/state-configuration.interface';
import { StateActionClass } from '../models/state-action-class.interface';
import { StatesCrudIndex } from '../indexes/states-crud-index';

export abstract class StatesHelper {
  static prefix = 'State_'

  private static basicStates = new StatesIndex(StateManager, StateContext);
  private static crudStates = new StatesCrudIndex(StateCrudManager, StateCrudContext);

  static getState<C extends StateExtend, S extends ValueRecord>(stateKey: string) {
    return this.getIndex(stateKey).getStateByKey(stateKey);
  }

  static registerSelect<C extends StateExtend, S extends ValueRecord, T>(
    stateClass: StateExtendClass<C>,
    selectKey: string,
    selectFunction: StateSelectFunction<S, T>,
    path?: ValueKey | ValueKey[]
  ) {
    const stateKey = stateClass.getStateKey();
    return this.getIndex(stateKey).registerSelect(stateClass, selectKey, selectFunction, path);
  }

  static registerAction<A extends Object, C extends StateExtend, CO extends StateContext<S>, S extends ValueRecord, T>(
    state: C,
    action: StateActionWithPayloadDefinition<T> | StateActionWithoutPayloadDefinition,
    actionFunction: StateActionFunction<S, CO>,
  ) {
    const stateKey = (state.constructor as StateExtendClass<C>).getStateKey();
    return this.getIndex(stateKey).registerAction(state, action, actionFunction);
  }

  static registerObserver<C extends StateExtend, S extends ValueRecord, T>(
    stateClass: StateExtendClass<C>,
    selectKey: string,
    observerKey: string,
    observer: WritableSignal<T>
  ) {
    const stateKey = stateClass.getStateKey();
    return this.getIndex(stateKey).registerObserver(stateClass, selectKey, observerKey, observer);
  }

  static registerState<C extends StateExtend, S extends ValueRecord>(
    stateClass: StateExtendClass<C>,
    configuration: StateConfiguration<S>
  ) {
    const stateKey = stateClass.getStateKey();
    return this.getIndex(stateKey).registerState(stateClass, configuration);
  }

  static registerStateCrud<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    configuration: StateCrudConfiguration<S, I>
  ) {
    this.crudStates.registerState(stateClass, configuration);

    const stateKey = stateClass.getStateKey();
    const stateManager = this.basicStates.getStateByKey(stateKey);

    this.crudStates.import(stateKey, stateManager);
    this.basicStates.removeState(stateKey);
  }

  static dispatch<C extends StateExtend, S extends ValueRecord>(
    stateClass: StateExtendClass<C>,
    actions: StateActionClass[]
  ) {
    const stateKey = stateClass.getStateKey();
    return this.getIndex(stateKey).dispatch(stateClass, actions);
  }

  static dispatchFill<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I[]
  ) {
    return this.crudStates.dispatchFill(stateClass, payload)
  }

  static dispatchAdd<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I
  ) {
    return this.crudStates.dispatchAdd(stateClass, payload)
  }

  static dispatchReplace<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I
  ) {
    return this.crudStates.dispatchReplace(stateClass, payload)
  }

  static dispatchUpdate<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: Partial<I>
  ) {
    return this.crudStates.dispatchUpdate(stateClass, payload)
  }

  static dispatchRemove<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I
  ) {
    return this.crudStates.dispatchRemove(stateClass, payload)
  }

  static dispatchReset<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
  ) {
    return this.crudStates.dispatchReset(stateClass)
  }

  private static getIndex(stateKey: string) {
    if (this.crudStates.hasState(stateKey)) {
      return this.crudStates;
    } else {
      return this.basicStates;
    }
  }
}

