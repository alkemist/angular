import { Injectable } from '@angular/core';
import { StatesHelper } from './helpers/states-helper';
import { StateSelectFunction } from './models/state-select-function.type';
import { ValueRecord } from '@alkemist/smart-tools';
import { StateExtend } from './models';
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

    StatesHelper.dispatch(stateClass, actions);
  }
}
