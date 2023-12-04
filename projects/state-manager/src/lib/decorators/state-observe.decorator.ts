import "reflect-metadata";
import { ValueRecord } from '@alkemist/smart-tools';
import { signal, WritableSignal } from '@angular/core';
import { StateSelectFunction } from '../models/state-select-function.type';
import { StatesHelper } from '../helpers/states-helper';
import { StateExtend } from '../models';
import { StateExtendClass } from '../models/state-extend-class.type';

export function StateObserve<
  STATE extends StateExtend,
  DATA extends ValueRecord,
  ITEM
>(state: StateExtendClass<STATE>, selectFunction: StateSelectFunction<DATA, ITEM>) {
  return <PropertyDecorator>function (target: Object, propertyKey: keyof Object) {
    let observer = signal<ITEM | undefined>(undefined);

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

    StatesHelper.registerObserver<STATE, ITEM>(
      state,
      selectFunction.name,
      `${ target.constructor.name }.${ propertyKey }`,
      <WritableSignal<ITEM>>target[propertyKey],
    );
  }
}
