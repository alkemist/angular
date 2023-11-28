import { Injectable, Type } from '@angular/core';
import { StatesMap } from './indexes/states-map';
import { StateSelectFunction } from './models/state-select-function.type';
import { ValueRecord } from '@alkemist/smart-tools';
import { StateClass, StateExtend } from './models';

@Injectable({
  providedIn: 'root'
})
export class StateManager {
  /*constructor(@Optional() configuration?: StateManagerConfiguration<any>) {
    console.log('service configuration', configuration)
  }*/

  debug<C extends StateExtend, S extends ValueRecord>(
    stateClass: StateExtend
  ) {
    return StatesMap.getEventsIndex<C, S>(stateClass.stateKey)
  }

  select<C extends StateExtend, S extends ValueRecord, T>(
    stateClass: StateExtend,
    selectFunction: StateSelectFunction<S, T>
  ) {
    return StatesMap.getEventsIndex<C, S>(stateClass.stateKey).select(selectFunction.name);
  }

  dispatch<C extends StateExtend>(state: StateClass<C> & Type<StateExtend>, actions: any | any[]) {
    if (!Array.isArray(actions)) {
      actions = [ actions ];
    }

    StatesMap.dispatch(state, actions);
  }
}
