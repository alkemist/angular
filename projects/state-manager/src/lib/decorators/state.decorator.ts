import "reflect-metadata";
import { StateConfiguration, StateCrudConfiguration } from "../models/state-configuration.interface.js";
import { ValueRecord } from "@alkemist/smart-tools";
import { StatesHelper } from '../helpers/states-helper';
import { StateCrud, StateCrudExtend, StateExtend } from '../models';
import { StateExtendClass } from '../models/state-extend-class.type';

export function StateDefinition<C extends StateExtend, S extends ValueRecord>(configuration: StateConfiguration<S>) {
  return <ClassDecorator>function (target: StateExtendClass<C>) {
    //console.log('registerState', target.getStateKey(), target)

    StatesHelper.registerState<C, S>(target, configuration);

    return Reflect.getMetadata(Symbol("StateDefinition"), target);
  };
}

export function StateCrudDefinition<C extends StateCrudExtend<C, S, I>, S extends StateCrud<I>, I>(configuration: StateCrudConfiguration<S, I>) {
  return <ClassDecorator>function (target: StateExtendClass<C>) {
    //console.log('registerStateCrud', stateKey, target.getStateKey(), target)

    StatesHelper.registerStateCrud<C, S, I>(target, configuration);

    return Reflect.getMetadata(Symbol("StateCrudDefinition"), target);
  };
}

