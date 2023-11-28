import { CONSOLE_LOG_STYLES, ConsoleHelper, SmartMap, TypeHelper, ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { StateSelect } from "../models/state-select";
import { StateConfiguration } from "../models/state-configuration.interface";
import { StateSelectFunction } from "../models/state-select-function.type";
import { StateActionFunction } from "../models/state-action-function.type";
import { WritableSignal } from "@angular/core";
import { StateContext } from '../models';
import { CompareEngine } from '@alkemist/compare-engine';
import { NotInitializedStateError } from '../models/not-initialized-state.error';
import { UnknownSelect } from '../models/unknown-select.error';
import {
  StateActionWithoutPayloadDefinition,
  StateActionWithPayloadDefinition
} from '../models/state-action-definition.interface';

export class EventsIndex<C extends Object = Object, S extends ValueRecord = any, T = any> {
  private selects = new SmartMap<StateSelect<S>>();
  private actions = new SmartMap<{
    log: string,
    fn: StateActionFunction<S, T>
  }>();
  private configuration!: StateConfiguration<S>;
  private state!: CompareEngine<S>;
  private stateKey!: string;

  initContext(stateKey: string, configuration: StateConfiguration<S>) {
    this.stateKey = stateKey;
    this.configuration = configuration;

    let defaultsValue = configuration.defaults;

    if (configuration.enableLocalStorage) {
      const stored = localStorage.getItem(this.stateKey);
      if (stored) {
        defaultsValue = {
          ...defaultsValue,
          ...JSON.parse(stored)
        };
      }
    }

    this.state = new CompareEngine<S>(
      configuration.determineArrayIndexFn,
      TypeHelper.deepClone(defaultsValue),
      TypeHelper.deepClone(defaultsValue),
    );

    if (this.configuration.showLog) {
      ConsoleHelper.group(
        `[State][${ this.stateKey }] Loaded`,
        [ { title: 'Init state', data: defaultsValue } ],
        [ CONSOLE_LOG_STYLES.blue, CONSOLE_LOG_STYLES.red ]
      )
    }
  }

  getState(stateKey?: string) {
    if (!this.state) {
      throw new NotInitializedStateError(stateKey ?? 'unknown')
    }

    return <S>this.state.rightValue;
  }

  setSelect<T>(
    selectKey: string,
    selectFunction: StateSelectFunction<S, T>,
    path?: ValueKey | ValueKey[]
  ) {
    const stateSelect = new StateSelect(selectFunction, path);
    this.selects.set(selectKey, stateSelect);
  }

  setObserver(
    stateKey: string,
    selectKey: string,
    observerKey: string,
    observer: WritableSignal<any>
  ) {
    if (!this.selects.get(selectKey)) {
      throw new UnknownSelect(selectKey);
    }

    this.selects.get(selectKey)
      .addObserver(observerKey, observer)
      .update(this.getState(stateKey))
  }

  setAction(action: StateActionWithPayloadDefinition<T> | StateActionWithoutPayloadDefinition, actionFunction: StateActionFunction<S, T>) {
    this.actions.set(action.name, {
      log: action.log,
      fn: actionFunction
    });
  }

  select(selectKey: string): T {
    return (<StateSelect<S, T>>this.selects.get(selectKey))
      .getValue(this.getState())
  }

  apply(actionKey: string, payload?: T) {
    const action = this.actions.get(actionKey);

    action.fn.apply(action.fn, [
      new StateContext<S>(this.state),
      payload
    ])

    if (this.configuration.showLog) {
      const logs = [];
      const colors = [
        CONSOLE_LOG_STYLES.blue
      ];

      if (payload) {
        logs.push({ title: 'Payload', data: payload })
        colors.push(CONSOLE_LOG_STYLES.green);
      }

      ConsoleHelper.group(
        `[State][${ this.stateKey }] Action "${ action.log }"`,
        [
          ...logs,
          { title: 'Before', data: TypeHelper.deepClone(this.state.leftValue) },
          { title: 'After', data: TypeHelper.deepClone(this.state.rightValue) }
        ],
        [ ...colors, CONSOLE_LOG_STYLES.grey, CONSOLE_LOG_STYLES.red ]
      )
    }
  }

  update() {
    this.selects
      .filter((select) =>
        select.path
          ? !this.state.getRightState(select.path).isEqual
          : true
      )
      .each((select) =>
        select.update(this.getState())
      )

    this.state.rightToLeft();

    if (this.configuration.enableLocalStorage) {
      localStorage.setItem(
        this.stateKey,
        JSON.stringify(
          this.state.leftValue
        )
      );
    }
  }
}
