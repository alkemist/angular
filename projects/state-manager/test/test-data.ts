import { ValueRecord } from "@alkemist/smart-tools";
import { computed, Signal, WritableSignal } from '@angular/core';
import { StateContext, StateExtend } from '../src/lib/models';
import { StateAction, StateDefinition, StateObserve, StateSelect } from '../src/lib/decorators';
import { StatesHelper } from '../src/lib/helpers/states-helper';
import { StateManagerService } from '../src/lib/state-manager.service';

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
export const exampleStorageName = `${ StatesHelper.prefix }${ exampleStateName }`;
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

@StateDefinition({
  defaults: <ExampleStateInterface>{
    aStringValue: aStringValueDefault,
    anObjectValue: anObjectValueDefault,
    aBooleanValue: aBooleanValueDefault,
  },
  showLog: true,
  enableLocalStorage: true
})
export class ExampleState extends StateExtend {
  stateKey = exampleStateName;

  @StateSelect('aStringValue')
  static aStringValueSelector(state: ExampleStateInterface): string {
    return state.aStringValue;
  }

  @StateSelect('anObjectValue')
  static anObjectValueSelector(state: ExampleStateInterface): UserInterface | null {
    return state.anObjectValue;
  }

  @StateSelect('aBooleanValue')
  static aBooleanValueSelector(state: ExampleStateInterface): boolean {
    return state.aBooleanValue;
  }

  @StateAction(Example.aStringValueAction)
  aStringValueAction(context: StateContext<ExampleStateInterface>, payload: string) {
    context.patchState({
      aStringValue: payload
    })
  }

  @StateAction(Example.aObjectValueAction)
  aObjectValueAction(context: StateContext<ExampleStateInterface>, payload: UserInterface) {
    context.patchState({
      anObjectValue: payload
    })
  }
}

export class ExampleComponent {
  @StateObserve(ExampleState, ExampleState.aStringValueSelector)
  aStringValueObserver!: WritableSignal<string>;

  @StateObserve(ExampleState, ExampleState.anObjectValueSelector)
  anObjectValueObserver!: WritableSignal<UserInterface | null>;

  @StateObserve(ExampleState, ExampleState.aBooleanValueSelector)
  aBooleanValueObserver!: WritableSignal<boolean>;

  aStringValueComputed: Signal<string>;

  constructor(private stateManager: StateManagerService, private userService: UserService) {
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
      ExampleState,
      new Example.aStringValueAction(value)
    )
  }

  dispatchObjectValue(user: UserInterface) {
    return this.userService.login(user);
  }
}

export class UserService {
  constructor(private stateManager: StateManagerService) {
  }

  getLoggedUser(user: UserInterface) {
    return new Promise<UserInterface>(resolve => resolve(user))
  }

  login(user: UserInterface): Promise<void> {
    return new Promise<void>(async resolve => {
      const userResponse: UserInterface = await this.getLoggedUser(user);

      this.stateManager.dispatch(
        ExampleState,
        new Example.aObjectValueAction(userResponse)
      )
      resolve();
    })
  }
}
