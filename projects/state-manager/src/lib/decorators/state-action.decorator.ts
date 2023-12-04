import "reflect-metadata";
import { ValueRecord } from "@alkemist/smart-tools";
import { StateActionFunction } from '../models/state-action-function.type';
import {
  StateActionWithoutPayloadDefinition,
  StateActionWithPayloadDefinition
} from '../models/state-action-definition.interface';
import { StateContext, StateExtend } from '../models';
import { StatesHelper } from '../helpers/states-helper';

export function StateAction<
  STATE extends StateExtend,
  CONTEXT extends StateContext<DATA>,
  DATA extends ValueRecord,
  ITEM
>(
  action: StateActionWithPayloadDefinition<ITEM> | StateActionWithoutPayloadDefinition,
): MethodDecorator {
  return <MethodDecorator>function (
    target: STATE,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<StateActionFunction<DATA, CONTEXT>>
  ) {
    /*console.log('registerAction',
      (target.constructor as StateExtendClass<C>).getStateKey(),
      action.name,
      target,
    )*/

    StatesHelper.registerAction<STATE, CONTEXT, DATA, ITEM>(
      target,
      action,
      descriptor.value!,
    );

    return Reflect.getMetadata(Symbol("StateAction"), target, propertyKey);
  };
}
