import { StateManager } from "../managers/state-manager";
import { StatesIndex } from '../indexes/states-index';
import { StateCrudManager } from '../managers/state-crud-manager';
import { StateContext, StateCrud, StateCrudExtend, StateExtend } from '../models';
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

  private static basicStates = new StatesIndex(StateManager);
  private static crudStates = new StatesCrudIndex(StateCrudManager);

  static getState<C extends StateExtend, S extends ValueRecord>(stateKey: string) {
    return this.getIndex(stateKey).getState(stateKey);
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
    actionFunction: StateActionFunction<S, CO, T>,
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

    if (this.basicStates.hasState(stateKey)) {
      const stateManager = this.basicStates.getState(stateKey);

      this.crudStates.import(stateKey, stateManager);

      this.basicStates.removeState(stateKey);
    }
  }

  static dispatch<C extends StateExtend, S extends ValueRecord>(
    stateClass: StateExtendClass<C>,
    actions: StateActionClass[]
  ) {
    const stateKey = stateClass.getStateKey();
    return this.getIndex(stateKey).dispatch(stateClass, actions);
  }

  static dispatchCrud<C extends StateExtend, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<StateCrudExtend<C, S, I>>,
    actions: 'add'[],
    payload: I,
  ) {
    const stateKey = stateClass.getStateKey();
    return this.crudStates.dispatchCrud(stateClass, actions, payload);
  }

  private static getIndex(stateKey: string) {
    if (this.crudStates.hasState(stateKey)) {
      return this.crudStates;
    } else {
      return this.basicStates;
    }
  }
}

