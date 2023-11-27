import { CONSOLE_LOG_STYLES, ConsoleHelper, SmartMap, ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { StateSelect } from "../models/state-select";
import { StateConfiguration } from "../models/state-configuration.interface";
import { StateSelectFunction } from "../models/state-select-function.type";
import { StateActionFunction } from "../models/state-action-function.type";
import { WritableSignal } from "@angular/core";
import { StateContext } from '../models/state.context';
import { CompareEngine } from '@alkemist/compare-engine';

export class SelectsIndex<C extends Object = Object, S extends ValueRecord = any> {
  private selects = new SmartMap<StateSelect<S>>();
  private configuration!: StateConfiguration<C, S>;
  private state!: CompareEngine<S>;
  private stateKey!: string;

  initContext(configuration: StateConfiguration<C, S>) {
    this.configuration = configuration;
    this.stateKey = configuration.name;

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
      defaultsValue,
      defaultsValue,
    );

    if (this.configuration.showLog) {
      ConsoleHelper.group(
        `[State][${ this.stateKey }] Loaded`,
        [ { title: 'Init state', data: defaultsValue } ],
        [ CONSOLE_LOG_STYLES.blue, CONSOLE_LOG_STYLES.red ]
      )
    }
  }

  getState() {
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
    selectKey: string,
    observerKey: string,
    observer: WritableSignal<any>
  ) {
    this.selects.get(selectKey)
      .addObserver(observerKey, observer)
      .update(this.getState());
  }

  select<T>(selectKey: string): T {
    return (<StateSelect<S, T>>this.selects.get(selectKey))
      .getValue(this.getState())
  }

  apply<T>(actionKey: string, actionFunction: StateActionFunction<S, T>, payload: T) {
    actionFunction.apply(actionFunction, [
      new StateContext(this.state),
      payload
    ])

    if (this.configuration.showLog) {

      ConsoleHelper.group(
        `%c [State][${ this.stateKey }] Action "${ actionKey }"`,
        [
          { title: 'Payload', data: payload },
          { title: 'Before', data: this.state.leftValue },
          { title: 'After', data: this.state.rightValue }
        ],
        [ CONSOLE_LOG_STYLES.blue, CONSOLE_LOG_STYLES.green, CONSOLE_LOG_STYLES.grey, CONSOLE_LOG_STYLES.red ]
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
