import { Injectable } from '@angular/core';
import { StatesHelper } from './helpers/states-helper';
import { StateSelectFunction } from './models/state-select-function.type';
import { ValueRecord } from '@alkemist/smart-tools';
import { StateCrud, StateCrudExtend, StateExtend } from './models';
import { StateExtendClass } from './models/state-extend-class.type';

@Injectable({
  providedIn: 'root'
})
export class StateManagerService {
  /*constructor(@Optional() configuration?: StateManagerConfiguration<any>) {
    console.log('service configuration', configuration)
  }*/

  debug<C extends StateExtend, S extends ValueRecord>(
    stateClass: StateExtendClass<C>
  ) {
    const stateKey = (new (stateClass as any)).stateKey;
    return StatesHelper.getState<C, S>(stateKey)
  }

  select<C extends StateExtend, S extends ValueRecord, T>(
    stateClass: StateExtendClass<C>,
    selectFunction: StateSelectFunction<S, T>
  ) {
    const stateKey = (new (stateClass as any)).stateKey;
    return StatesHelper.getState<C, S>(stateKey).select(selectFunction.name);
  }

  dispatch<C extends StateExtend>(stateClass: StateExtendClass<C>, actions: any | any[]) {
    if (!Array.isArray(actions)) {
      actions = [ actions ];
    }

    return StatesHelper.dispatch(stateClass, actions);
  }

  dispatchFill<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I[]
  ) {
    return StatesHelper.dispatchFill(stateClass, payload);
  }

  dispatchAdd<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I
  ) {
    return StatesHelper.dispatchAdd(stateClass, payload);
  }

  dispatchReplace<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I
  ) {
    return StatesHelper.dispatchReplace(stateClass, payload);
  }

  dispatchUpdate<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: Partial<I>
  ) {
    return StatesHelper.dispatchUpdate(stateClass, payload);
  }

  dispatchRemove<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
    payload: I
  ) {
    return StatesHelper.dispatchRemove(stateClass, payload);
  }

  dispatchReset<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(
    stateClass: StateExtendClass<C>,
  ) {
    return StatesHelper.dispatchReset(stateClass);
  }
}
