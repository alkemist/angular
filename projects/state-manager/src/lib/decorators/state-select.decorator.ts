import "reflect-metadata";
import { ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { StatesHelper } from '../helpers/states-helper';
import { StateSelectFunction } from '../models/state-select-function.type';
import { StateExtendClass } from '../models/state-extend-class.type';
import { StateExtend } from '../models';

export function StateSelect<
  STATE extends StateExtend,
  DATA extends ValueRecord,
  ITEM
>(pathForCheckUpdated?: ValueKey | ValueKey[]) {
  return <MethodDecorator>function (
    target: StateExtendClass<STATE>,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<StateSelectFunction<DATA, ITEM>>
  ) {
    /*console.log('registerSelect',
      target.getStateKey(),
      propertyKey,
      target
    )*/

    StatesHelper.registerSelect<STATE, DATA, ITEM>(
      target,
      propertyKey,
      descriptor.value!,
      pathForCheckUpdated
    );

    return Reflect.getMetadata(Symbol("StateSelect"), target, propertyKey);
  };
}
