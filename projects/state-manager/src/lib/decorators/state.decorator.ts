import "reflect-metadata";
import { StateConfiguration, StateCrudConfiguration } from "../models/state-configuration.interface.js";
import { ValueRecord } from "@alkemist/smart-tools";
import { StatesHelper } from '../helpers/states-helper';
import { StateCrudData, StateCrudExtend, StateExtend } from '../models';
import { StateExtendClass } from '../models/state-extend-class.type';

export function StateDefinition<
  STATE extends StateExtend,
  DATA extends ValueRecord
>(configuration: StateConfiguration<DATA>) {
  return <ClassDecorator>function (target: StateExtendClass<STATE>) {
    //console.log('registerState', target.getStateKey(), target)

    StatesHelper.registerState<STATE, DATA>(target, configuration);

    return Reflect.getMetadata(Symbol("StateDefinition"), target);
  };
}

export function StateCrudDefinition<
  STATE extends StateCrudExtend<STATE, DATA, ITEM>,
  DATA extends StateCrudData<ITEM>,
  ITEM
>(configuration: StateCrudConfiguration<DATA, ITEM>) {
  return <ClassDecorator>function (target: StateExtendClass<STATE>) {
    //console.log('registerStateCrud', stateKey, target.getStateKey(), target)

    StatesHelper.registerStateCrud<STATE, DATA, ITEM>(target, configuration);

    return Reflect.getMetadata(Symbol("StateCrudDefinition"), target);
  };
}

