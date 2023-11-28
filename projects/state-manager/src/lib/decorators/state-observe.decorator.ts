import "reflect-metadata";
import { ValueRecord } from '@alkemist/smart-tools';
import { signal, WritableSignal } from '@angular/core';
import { StateSelectFunction } from '../models/state-select-function.type';
import { StatesMap } from '../indexes/states-map';
import { StateExtend } from '../models';
import { StateConstructor } from '../models/state-constructor.type';

export function Observe<C extends StateExtend, S extends ValueRecord, T>(state: StateConstructor<StateExtend>, selectFunction: StateSelectFunction<S, T>) {
  return <PropertyDecorator>function (target: Object, propertyKey: keyof Object) {
    let observer = signal<T | undefined>(undefined);

    Object.defineProperty(target, propertyKey,
      {
        value: observer,
        writable: false,
      }
    );

    /*console.log('registerObserver',
      state.name,
      selectFunction.name,
      target.constructor.name,
      propertyKey,
      state.stateKey,
      state
    )*/
    StatesMap.registerObserver<C, S, T>(
      state.stateKey,
      selectFunction.name,
      `${ target.constructor.name }.${ propertyKey }`,
      <WritableSignal<T>>target[propertyKey],
    );
  }
}
