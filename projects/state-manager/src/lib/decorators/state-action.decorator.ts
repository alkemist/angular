import "reflect-metadata";
import { ValueRecord } from "@alkemist/smart-tools";
import { StateActionFunction } from '../models/state-action-function.type';
import {
  StateActionWithoutPayloadDefinition,
  StateActionWithPayloadDefinition
} from '../models/state-action-definition.interface';
import { StateExtend } from '../models';
import { StatesMap } from '../indexes/states-map';

export function Action<A extends Object, C extends StateExtend, S extends ValueRecord, T>(
  action: StateActionWithPayloadDefinition<T> | StateActionWithoutPayloadDefinition,
): MethodDecorator {
  return <MethodDecorator>function (
    target: C,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<StateActionFunction<S, T>>
  ) {
    const stateKey = (new (target.constructor as any)).stateKey;

    StatesMap.registerAction<A, C, S, T>(
      stateKey,
      action,
      descriptor.value!,
    );

    return Reflect.getMetadata(Symbol("Action"), target, propertyKey);
  };
}
