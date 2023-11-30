import "reflect-metadata";
import { ValueRecord } from '@alkemist/smart-tools';
import { signal, WritableSignal } from '@angular/core';
import { StateSelectFunction } from '../models/state-select-function.type';
import { StatesHelper } from '../helpers/states-helper';
import { StateExtend } from '../models';
import { StateExtendClass } from '../models/state-extend-class.type';

export function StateObserve<C extends StateExtend, S extends ValueRecord, T>(state: StateExtendClass<C>, selectFunction: StateSelectFunction<S, T>) {
  return <PropertyDecorator>function (target: Object, propertyKey: keyof Object) {
    let observer = signal<T | undefined>(undefined);

    /*console.log('registerObserver',
      state.getStateKey(),
      selectFunction.name,
      propertyKey,
    )*/

    Object.defineProperty(target, propertyKey,
      {
        value: observer,
        writable: false,
      }
    );

    StatesHelper.registerObserver<C, S, T>(
      state,
      selectFunction.name,
      `${ target.constructor.name }.${ propertyKey }`,
      <WritableSignal<T>>target[propertyKey],
    );
  }
}
