import "reflect-metadata";
import { StateConfiguration } from "../models/state-configuration.interface.js";
import { ValueRecord } from "@alkemist/smart-tools";
import { StatesMap } from '../indexes/states-map';
import { StateExtend } from '../models';
import { StateConstructor } from '../models/state-constructor.type';

export function State<C extends StateExtend, S extends ValueRecord>(configuration: StateConfiguration<S>) {
  return <ClassDecorator>function (target: StateConstructor<C>) {
    //console.log('registerState', target.stateKey, target)
    StatesMap.registerState<C, S>(target.stateKey, configuration);

    return Reflect.getMetadata(Symbol("State"), target);
  };
}

