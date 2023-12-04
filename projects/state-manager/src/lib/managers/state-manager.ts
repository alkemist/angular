import { CONSOLE_LOG_STYLES, ConsoleHelper, SmartMap, TypeHelper, ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { StateSelect } from "../models/state-select";
import { StateConfiguration } from "../models/state-configuration.interface";
import { StateSelectFunction } from "../models/state-select-function.type";
import { StateActionFunction } from "../models/state-action-function.type";
import { Type, WritableSignal } from "@angular/core";
import { StateContext } from '../models';
import { CompareEngine } from '@alkemist/compare-engine';
import { NotInitializedStateError } from '../models/not-initialized-state.error';
import { UnknownSelect } from '../models/unknown-select.error';
import {
  StateActionWithoutPayloadDefinition,
  StateActionWithPayloadDefinition
} from '../models/state-action-definition.interface';
import { UnknownAction } from '../models/unknown-action.error';
import { StatesHelper } from '../helpers/states-helper';

export class StateManager<
  ITEM = any,
  DATA extends ValueRecord = any,
  CONTEXT extends StateContext<DATA> = any,
> {
  protected selects = new SmartMap<StateSelect<DATA>>();
  protected actions = new SmartMap<{
    log: string,
    fn: StateActionFunction<DATA, CONTEXT>
  }>();
  protected configuration!: StateConfiguration<DATA>;
  protected compareEngine!: CompareEngine<DATA>;
  protected stateKey!: string;
  protected storageKey!: string;

  constructor(private contextFactory: Type<CONTEXT>) {
  }

  initContext(stateKey: string, configuration: StateConfiguration<DATA>) {
    this.stateKey = stateKey;
    this.storageKey = `${ StatesHelper.prefix }${ this.stateKey }`;

    this.configuration = configuration;

    let defaultsValue = configuration.defaults;

    if (configuration.enableLocalStorage) {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        defaultsValue = {
          ...defaultsValue,
          ...JSON.parse(stored)
        };
      }
    }

    this.compareEngine = new CompareEngine<DATA>(
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

  getState(stateKey?: string) {
    if (!this.compareEngine) {
      throw new NotInitializedStateError(stateKey ?? 'unknown')
    }

    return <DATA>this.compareEngine.rightValue;
  }

  setSelect<T>(
    selectKey: string,
    selectFunction: StateSelectFunction<DATA, T>,
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

  setAction(action: StateActionWithPayloadDefinition<ITEM> | StateActionWithoutPayloadDefinition, actionFunction: StateActionFunction<DATA, CONTEXT>) {
    this.actions.set(action.name, {
      log: action.log,
      fn: actionFunction
    });
  }

  select(selectKey: string): unknown {
    return (<StateSelect<DATA, ITEM>>this.selects.get(selectKey))
      .getValue(this.getState())
  }

  getAction(actionKey: string) {
    return this.actions.get(actionKey);
  }

  apply(actionKey: string, payload?: any) {
    const action = this.getAction(actionKey);

    if (!action) {
      throw new UnknownAction(actionKey);
    }

    this.actionApply(action.fn, payload);

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
          { title: 'Before', data: TypeHelper.deepClone(this.compareEngine.leftValue) },
          { title: 'After', data: TypeHelper.deepClone(this.compareEngine.rightValue) }
        ],
        [ ...colors, CONSOLE_LOG_STYLES.grey, CONSOLE_LOG_STYLES.red ]
      )
    }
  }

  update() {
    this.selects
      .filter((select) =>
        select.path
          ? !this.compareEngine.getRightState(select.path).isEqual
          : true
      )
      .each((select) =>
        select.update(this.getState())
      )

    this.compareEngine.rightToLeft();

    if (this.configuration.enableLocalStorage) {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(
          this.compareEngine.leftValue
        )
      );
    }
  }

  protected actionApply(actionFn: StateActionFunction<DATA, CONTEXT>, payload?: ITEM) {
    actionFn.apply(actionFn, [
      new this.contextFactory(this.stateKey, this.compareEngine, this.configuration.determineArrayIndexFn),
      payload
    ])
  }
}
