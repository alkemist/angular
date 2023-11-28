import { ValueRecord } from "@alkemist/smart-tools";
import { computed, Signal, WritableSignal } from '@angular/core';
import { StateContext } from '../src/lib/models/state-context';
import { State } from '../src/lib/decorators/state.decorator';
import { Select } from '../src/lib/decorators/state-select.decorator';
import { Action } from '../src/lib/decorators/state-action.decorator';
import { Observe } from '../src/lib/decorators/state-observe.decorator';
import { StateManager } from '../src/lib/state-manager.service';

export interface UserInterface {
  id: number,
  name: string,
}

export interface ExampleStateInterface extends ValueRecord {
  aStringValue: string;
  anObjectValue: UserInterface | null;
  aBooleanValue: boolean;
}

export const exampleStateName = 'ExampleState'
export const aStringValueDefault = 'init';
export const anObjectValueDefault = null;
export const aBooleanValueDefault = false;

export namespace Example {
  export class aStringValueAction {
    static readonly log = "An string value action";

    constructor(public payload: string) {
    }
  }

  export class aObjectValueAction {
    static readonly log = "An object value action";

    constructor(public payload: UserInterface) {
    }
  }

  export class aUnknownValueAction {
    static readonly log = "An unknown value action";

    constructor(public payload: unknown) {
    }
  }
}

@State({
  name: 'ExampleState',
  class: ExampleState,
  defaults: <ExampleStateInterface>{
    aStringValue: aStringValueDefault,
    anObjectValue: anObjectValueDefault,
    aBooleanValue: aBooleanValueDefault,
  },
  showLog: true,
  enableLocalStorage: true
})
export class ExampleState {
  @Select('aStringValue')
  static aStringValueSelector(state: ExampleStateInterface): string {
    return state.aStringValue;
  }

  @Select('anObjectValue')
  static anObjectValueSelector(state: ExampleStateInterface): UserInterface | null {
    return state.anObjectValue;
  }

  @Select('aBooleanValue')
  static aBooleanValueSelector(state: ExampleStateInterface): boolean {
    return state.aBooleanValue;
  }

  @Action(Example.aStringValueAction)
  aStringValueAction(context: StateContext<ExampleStateInterface>, payload: string) {
    context.patchState({
      aStringValue: payload
    })
  }

  @Action(Example.aObjectValueAction)
  aObjectValueAction(context: StateContext<ExampleStateInterface>, payload: UserInterface) {
    context.patchState({
      anObjectValue: payload
    })
  }
}

export class ExampleComponent {
  @Observe(ExampleState, ExampleState.aStringValueSelector)
  aStringValueObserver!: WritableSignal<string>;

  @Observe(ExampleState, ExampleState.anObjectValueSelector)
  anObjectValueObserver!: WritableSignal<UserInterface | null>;

  @Observe(ExampleState, ExampleState.aBooleanValueSelector)
  aBooleanValueObserver!: WritableSignal<boolean>;

  aStringValueComputed: Signal<string>;

  constructor(private stateManager: StateManager, private userService: UserService) {
    this.aStringValueComputed = computed(() => {
      this.onChange(this.aStringValueObserver());
      return this.aStringValueObserver();
    });
  }

  onChange(value: string) {
    return value;
  }

  getStringValue() {
    return this.stateManager.select(ExampleState, ExampleState.aStringValueSelector);
  }

  dispatchStringValue(value: string) {
    this.stateManager.dispatch(
      new Example.aStringValueAction(value)
    )
  }

  dispatchObjectValue(user: UserInterface) {
    return this.userService.login(user);
  }
}

export class UserService {
  constructor(private stateManager: StateManager) {
  }

  getLoggedUser(user: UserInterface) {
    return new Promise<UserInterface>(resolve => resolve(user))
  }

  login(user: UserInterface): Promise<void> {
    return new Promise<void>(async resolve => {
      const userResponse: UserInterface = await this.getLoggedUser(user);

      this.stateManager.dispatch(
        new Example.aObjectValueAction(userResponse)
      )
      resolve();
    })
  }
}
