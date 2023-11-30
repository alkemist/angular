import "reflect-metadata";
import { ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { StatesHelper } from '../helpers/states-helper';
import { StateSelectFunction } from '../models/state-select-function.type';
import { StateExtendClass } from '../models/state-extend-class.type';
import { StateExtend } from '../models';

export function StateSelect<C extends StateExtend, S extends ValueRecord, T>(pathForCheckUpdated?: ValueKey | ValueKey[]) {
  return <MethodDecorator>function (
    target: StateExtendClass<C>,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<StateSelectFunction<S, T>>
  ) {
    /*console.log('registerSelect',
      target.getStateKey(),
      propertyKey,
      target
    )*/

    StatesHelper.registerSelect<C, S, T>(
      target,
      propertyKey,
      descriptor.value!,
      pathForCheckUpdated
    );

    return Reflect.getMetadata(Symbol("StateSelect"), target, propertyKey);
  };
}
