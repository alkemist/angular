import { ValueKey, ValueRecord } from '@alkemist/smart-tools';
import { StateConfiguration } from '../models/state-configuration.interface';
import { StateSelectFunction } from '../models/state-select-function.type';
import { StateActionFunction } from '../models/state-action-function.type';
import { WritableSignal } from '@angular/core';
import { EventsIndex } from "./events-index";
import { StateActionClass } from '../models/state-action-class.interface';
import { StateClass, StateExtend } from '../models';
import {
  StateActionWithoutPayloadDefinition,
  StateActionWithPayloadDefinition
} from '../models/state-action-definition.interface';

export abstract class StatesMap {
  private static eventsByState = new Map<string, EventsIndex>();

  static registerSelect<C extends StateExtend, S extends ValueRecord, T>(
    stateKey: string,
    selectKey: string,
    selectFunction: StateSelectFunction<S, T>,
    path?: ValueKey | ValueKey[]
  ) {
    let map = StatesMap.getOrCreate<C, S>(stateKey);

    map.setSelect(selectKey, selectFunction, path);
    StatesMap.eventsByState.set(stateKey, map);
  }

  static registerAction<A extends Object, C extends Object, S extends ValueRecord, T>(
    stateKey: string,
    action: StateActionWithPayloadDefinition<T> | StateActionWithoutPayloadDefinition,
    actionFunction: StateActionFunction<S, T>,
  ) {
    let map = StatesMap.getOrCreate<C, S>(stateKey);

    map.setAction(action, actionFunction);
    StatesMap.eventsByState.set(stateKey, map);
  }

  static registerObserver<C extends Object, S extends ValueRecord, T>(
    stateKey: string,
    selectKey: string,
    observerKey: string,
    observer: WritableSignal<T>
  ) {
    let map = StatesMap.getOrCreate<C, S>(stateKey);

    map.setObserver(stateKey, selectKey, observerKey, observer);
    StatesMap.eventsByState.set(stateKey, map);
  }

  static registerState<C extends Object, S extends ValueRecord>(
    stateKey: string,
    configuration: StateConfiguration<S>
  ) {
    let map = StatesMap.getOrCreate<C, S>(stateKey);

    map.initContext(stateKey, configuration);
  }

  static getEventsIndex<C extends Object, S extends ValueRecord>(stateKey: string) {
    return <EventsIndex<C, S>>StatesMap.eventsByState.get(stateKey)
  }

  static dispatch<C extends StateExtend, S extends ValueRecord>(state: StateClass<C>, actions: StateActionClass[]) {
    //const stateKeysToUpdate: string[] = [];
    const eventsIndex = StatesMap.getEventsIndex<C, S>(state.stateKey);

    /*actions.forEach(action => {
      const actionKey = action.constructor.name;
      const stateAction = StatesMap

      if (!stateAction) {
        throw new UnknownAction(actionKey)
      }

      StatesMap.getEventsIndex(stateAction.stateKey)
        .apply(actionKey, stateAction.actionFunction, action.payload);

      if (stateKeysToUpdate.indexOf(stateAction.stateKey) === -1) {
        stateKeysToUpdate.push(stateAction.stateKey)
      }
    })*/

    actions.forEach(action => {
      const actionKey = action.constructor.name;
      eventsIndex.apply(actionKey, action.payload);
    })

    eventsIndex.update()
  }

  private static hasState(stateKey: string) {
    return StatesMap.eventsByState.has(stateKey);
  }

  private static getOrCreate<C extends Object, S extends ValueRecord>(stateKey: string) {
    return StatesMap.hasState(stateKey)
      ? StatesMap.getEventsIndex<C, S>(stateKey)
      : new EventsIndex<C, S>();
  }
}

