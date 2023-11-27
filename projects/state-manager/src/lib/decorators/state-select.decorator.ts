import "reflect-metadata";
import { ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { Type } from '@angular/core';
import { StatesMap } from '../indexes/states-map';
import { StateSelectFunction } from '../models/state-select-function.type';

export function Select<C extends Object, S extends ValueRecord, T>(pathForCheckUpdated?: ValueKey | ValueKey[]) {
  return <MethodDecorator>function (
    target: Type<C>,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<StateSelectFunction<S, T>>
  ) {
    StatesMap.registerSelect<C, S, T>(
      target.name,
      propertyKey,
      descriptor.value!,
      pathForCheckUpdated
    );

    return Reflect.getMetadata(Symbol("Select"), target, propertyKey);
  };
}
