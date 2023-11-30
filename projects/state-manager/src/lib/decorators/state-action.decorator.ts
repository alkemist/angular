import "reflect-metadata";
import { ValueRecord } from "@alkemist/smart-tools";
import { StateActionFunction } from '../models/state-action-function.type';
import {
  StateActionWithoutPayloadDefinition,
  StateActionWithPayloadDefinition
} from '../models/state-action-definition.interface';
import { StateContext, StateExtend } from '../models';
import { StatesHelper } from '../helpers/states-helper';

export function StateAction<A extends Object, C extends StateExtend, CO extends StateContext<S>, S extends ValueRecord, T>(
  action: StateActionWithPayloadDefinition<T> | StateActionWithoutPayloadDefinition,
): MethodDecorator {
  return <MethodDecorator>function (
    target: C,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<StateActionFunction<S, CO>>
  ) {
    /*console.log('registerAction',
      (target.constructor as StateExtendClass<C>).getStateKey(),
      action.name,
      target,
    )*/

    StatesHelper.registerAction<A, C, CO, S, T>(
      target,
      action,
      descriptor.value!,
    );

    return Reflect.getMetadata(Symbol("StateAction"), target, propertyKey);
  };
}
