import { StateManager } from "../managers/state-manager";
import { StatesIndex } from '../indexes/states-index';
import { StateCrudManager } from '../managers/state-crud-manager';
import { StateContext, StateCrudContext, StateCrudData, StateCrudExtend, StateExtend } from '../models';
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

  static getState<MANAGER extends StateManager>(stateKey: string) {
    return this.getIndex(stateKey).getStateByKey(stateKey) as MANAGER;
  }

  static registerSelect<STATE extends StateExtend, DATA extends ValueRecord, ITEM>(
    stateClass: StateExtendClass<STATE>,
    selectKey: string,
    selectFunction: StateSelectFunction<DATA, ITEM>,
    path?: ValueKey | ValueKey[]
  ) {
    const stateKey = stateClass.getStateKey();
    return this.getIndex(stateKey).registerSelect(stateClass, selectKey, selectFunction, path);
  }

  static registerAction<STATE extends StateExtend, CONTEXT extends StateContext<DATA>, DATA extends ValueRecord, ITEM>(
    state: STATE,
    action: StateActionWithPayloadDefinition<ITEM> | StateActionWithoutPayloadDefinition,
    actionFunction: StateActionFunction<DATA, CONTEXT>,
  ) {
    const stateKey = (state.constructor as StateExtendClass<STATE>).getStateKey();
    return this.getIndex(stateKey).registerAction(state, action, actionFunction);
  }

  static registerObserver<STATE extends StateExtend, ITEM>(
    stateClass: StateExtendClass<STATE>,
    selectKey: string,
    observerKey: string,
    observer: WritableSignal<ITEM>
  ) {
    const stateKey = stateClass.getStateKey();
    return this.getIndex(stateKey).registerObserver(stateClass, selectKey, observerKey, observer);
  }

  static registerState<STATE extends StateExtend, DATA extends ValueRecord>(
    stateClass: StateExtendClass<STATE>,
    configuration: StateConfiguration<DATA>
  ) {
    const stateKey = stateClass.getStateKey();
    return this.getIndex(stateKey).registerState(stateClass, configuration);
  }

  static registerStateCrud<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    configuration: StateCrudConfiguration<DATA, ITEM>
  ) {
    this.crudStates.registerState(stateClass, configuration);

    const stateKey = stateClass.getStateKey();
    const oldStateManager = this.basicStates.getStateByKey(stateKey);

    this.crudStates.init(stateKey, oldStateManager);

    this.basicStates.removeState(stateKey);
  }

  static dispatch<STATE extends StateExtend>(
    stateClass: StateExtendClass<STATE>,
    actions: StateActionClass[]
  ) {
    const stateKey = stateClass.getStateKey();
    return this.getIndex(stateKey).dispatch(stateClass, actions);
  }

  static dispatchFill<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM[]
  ) {
    return this.crudStates.dispatchFill(stateClass, payload)
  }

  static dispatchAdd<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM
  ) {
    return this.crudStates.dispatchAdd(stateClass, payload)
  }

  static dispatchReplace<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM
  ) {
    return this.crudStates.dispatchReplace(stateClass, payload)
  }

  static dispatchUpdate<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: Partial<ITEM>
  ) {
    return this.crudStates.dispatchUpdate(stateClass, payload)
  }

  static dispatchRemove<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM
  ) {
    return this.crudStates.dispatchRemove(stateClass, payload)
  }

  static dispatchReset<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
  ) {
    return this.crudStates.dispatchReset(stateClass)
  }

  static selectAll<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>
  ) {
    return this.crudStates.selectAll<STATE, DATA, ITEM>(stateClass)
  }

  static selectLastUpdateDate<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>
  (stateClass: StateExtendClass<STATE>) {
    return this.crudStates.selectLastUpdateDate<STATE, DATA, ITEM>(stateClass)
  }

  private static getIndex(stateKey: string) {
    if (this.crudStates.hasState(stateKey)) {
      return this.crudStates;
    } else {
      return this.basicStates;
    }
  }
}

