import "reflect-metadata";
import { ValueRecord } from '@alkemist/smart-tools';
import { signal, Type, WritableSignal } from '@angular/core';
import { StateSelectFunction } from '../models/state-select-function.type';
import { StatesMap } from '../indexes/states-map';

export function Observe<C extends Object, S extends ValueRecord, T>(state: Type<C>, selectFunction: StateSelectFunction<S, T>) {
  return <PropertyDecorator>function (target: Object, propertyKey: keyof Object) {
    let observer = signal<T | undefined>(undefined);

    Object.defineProperty(target, propertyKey,
      {
        value: observer,
        writable: false,
      }
    );

    StatesMap.registerObserver<C, S, T>(
      state.name,
      selectFunction.name,
      `${ target.constructor.name }.${ propertyKey }`,
      <WritableSignal<T>>target[propertyKey],
    );
  }
}
