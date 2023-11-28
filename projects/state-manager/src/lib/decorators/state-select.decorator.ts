import "reflect-metadata";
import { ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { StatesMap } from '../indexes/states-map';
import { StateSelectFunction } from '../models/state-select-function.type';
import { StateConstructor } from '../models/state-constructor.type';
import { StateExtend } from '../models';

export function Select<C extends StateExtend, S extends ValueRecord, T>(pathForCheckUpdated?: ValueKey | ValueKey[]) {
  return <MethodDecorator>function (
    target: StateConstructor<C>,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<StateSelectFunction<S, T>>
  ) {
    /*console.log('registerSelect',
      target.name,
      target.stateKey,
      propertyKey,
      target
    )*/
    StatesMap.registerSelect<C, S, T>(
      target.stateKey,
      propertyKey,
      descriptor.value!,
      pathForCheckUpdated
    );

    return Reflect.getMetadata(Symbol("Select"), target, propertyKey);
  };
}
