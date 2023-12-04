import { Injectable } from '@angular/core';
import { StatesHelper } from './helpers/states-helper';
import { StateSelectFunction } from './models/state-select-function.type';
import { ValueRecord } from '@alkemist/smart-tools';
import { StateCrudData, StateCrudExtend, StateExtend } from './models';
import { StateExtendClass } from './models/state-extend-class.type';

@Injectable({
  providedIn: 'root'
})
export class StateManagerService {
  /*constructor(@Optional() configuration?: StateManagerConfiguration<any>) {
    console.log('service configuration', configuration)
  }*/

  debug<STATE extends StateExtend>(
    stateClass: StateExtendClass<STATE>
  ) {
    const stateKey = (new (stateClass as any)).stateKey;
    return StatesHelper.getState(stateKey)
  }

  select<STATE extends StateExtend, DATA extends ValueRecord, ITEM>(
    stateClass: StateExtendClass<STATE>,
    selectFunction: StateSelectFunction<DATA, ITEM>
  ) {
    const stateKey = (new (stateClass as any)).stateKey;
    return StatesHelper.getState(stateKey).select(selectFunction.name);
  }

  selectAll<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>
  ) {
    return StatesHelper.selectAll<STATE, DATA, ITEM>(stateClass);
  }

  selectLastUpdateDate<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>
  ) {
    return StatesHelper.selectLastUpdateDate<STATE, DATA, ITEM>(stateClass);
  }

  dispatch<STATE extends StateExtend>(stateClass: StateExtendClass<STATE>, actions: any | any[]) {
    if (!Array.isArray(actions)) {
      actions = [ actions ];
    }

    return StatesHelper.dispatch(stateClass, actions);
  }

  dispatchFill<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM[]
  ) {
    return StatesHelper.dispatchFill(stateClass, payload);
  }

  dispatchAdd<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM
  ) {
    return StatesHelper.dispatchAdd(stateClass, payload);
  }

  dispatchReplace<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM
  ) {
    return StatesHelper.dispatchReplace(stateClass, payload);
  }

  dispatchUpdate<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: Partial<ITEM>
  ) {
    return StatesHelper.dispatchUpdate(stateClass, payload);
  }

  dispatchRemove<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
    payload: ITEM
  ) {
    return StatesHelper.dispatchRemove(stateClass, payload);
  }

  dispatchReset<STATE extends StateCrudExtend<STATE, DATA, ITEM>, DATA extends StateCrudData<ITEM>, ITEM>(
    stateClass: StateExtendClass<STATE>,
  ) {
    return StatesHelper.dispatchReset(stateClass);
  }
}
