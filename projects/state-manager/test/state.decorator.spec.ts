import {
  aBooleanValueDefault,
  anObjectValueDefault,
  aStringValueDefault,
  Example,
  ExampleComponent,
  exampleStateName,
  UserInterface,
  UserService
} from './test-data.js';
import { effect, Injector } from '@angular/core';
import { StateManager } from '../src/lib/state-manager.service';
import { UnknownAction } from '../src/lib/models/unknown-action.error';
import { setUpSignalTesting, SignalTesting } from '../../../test/setup-effect';


describe("State Decorator", () => {
  let signalTesting: SignalTesting;

  let onChangeSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleGroupBeginSpy: jest.SpyInstance;
  let consoleGroupEndSpy: jest.SpyInstance;
  let setLocalStorageSpy: jest.SpyInstance;
  let getLocalStorageSpy: jest.SpyInstance;

  let exampleComponent: ExampleComponent;
  let userService: UserService;
  let stateManager: StateManager;

  const aStringValueTest = 'test';
  const aObjectValueTest: UserInterface = {
    name: 'user test',
    id: 1
  }

  beforeEach(() => {
    signalTesting = setUpSignalTesting();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleGroupBeginSpy = jest.spyOn(console, 'group').mockImplementation();
    consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();

    setLocalStorageSpy = jest.spyOn(localStorage, 'setItem');
    getLocalStorageSpy = jest.spyOn(localStorage, 'getItem');

    stateManager = new StateManager();
    userService = new UserService(stateManager);
    exampleComponent = new ExampleComponent(stateManager, userService);
    onChangeSpy = jest.spyOn(exampleComponent, 'onChange');
  })

  it('should dispatch string', () => {
    signalTesting.runInTestingInjectionContext((injector: Injector) => {
      let aStringValueEffect = '';

      effect(
        () => {
          aStringValueEffect = exampleComponent.aStringValueObserver();
        },
        { injector }
      );
      signalTesting.flushEffects();

      expect(exampleComponent.aStringValueObserver()).toEqual(aStringValueDefault);
      expect(exampleComponent.getStringValue()).toEqual(aStringValueDefault);
      expect(exampleComponent.aStringValueComputed()).toEqual(aStringValueDefault);
      expect(exampleComponent.aBooleanValueObserver()).toEqual(aBooleanValueDefault);
      expect(aStringValueEffect).toEqual(aStringValueDefault);
      expect(onChangeSpy).toBeCalledTimes(1);

      onChangeSpy.mockReset();
      setLocalStorageSpy.mockReset();
      exampleComponent.dispatchStringValue(aStringValueTest);
      signalTesting.flushEffects();

      expect(exampleComponent.aStringValueObserver()).toEqual(aStringValueTest);
      expect(exampleComponent.getStringValue()).toEqual(aStringValueTest);
      expect(exampleComponent.aStringValueComputed()).toEqual(aStringValueTest);
      expect(aStringValueEffect).toEqual(aStringValueTest);
      expect(onChangeSpy).toBeCalledTimes(1);
      expect(setLocalStorageSpy).toBeCalledTimes(1);
      expect(setLocalStorageSpy).toBeCalledWith(exampleStateName,
        `{` +
        `\"aStringValue\":\"${ aStringValueTest }\",` +
        `\"anObjectValue\":${ anObjectValueDefault },` +
        `\"aBooleanValue\":${ aBooleanValueDefault }` +
        `}`
      );

      onChangeSpy.mockReset();
      exampleComponent.dispatchStringValue(aStringValueTest);

      expect(onChangeSpy).not.toBeCalled();
      expect(consoleGroupBeginSpy).toBeCalledTimes(2);
      expect(consoleGroupEndSpy).toBeCalledTimes(2);
      expect(consoleLogSpy).toBeCalledTimes(2 * 3);
    })
  })

  it('should dispatch object', async () => {
    expect(exampleComponent.anObjectValueObserver()).toEqual(anObjectValueDefault);

    await exampleComponent.dispatchObjectValue(aObjectValueTest);

    expect(exampleComponent.anObjectValueObserver()).toEqual(aObjectValueTest);
    expect(setLocalStorageSpy).toBeCalledTimes(1);
    expect(setLocalStorageSpy).toBeCalledWith(exampleStateName,
      `{` +
      `\"aStringValue\":\"${ aStringValueTest }\",` +
      `\"anObjectValue\":{\"name\":\"${ aObjectValueTest.name }\",\"id\":${ aObjectValueTest.id }},` +
      `\"aBooleanValue\":${ aBooleanValueDefault }` +
      `}`
    );

    expect(consoleGroupBeginSpy).toBeCalledTimes(1);
    expect(consoleGroupEndSpy).toBeCalledTimes(1);
    expect(consoleLogSpy).toBeCalledTimes(3);
  });

  it('should throw errors', () => {
    expect(() => {
      stateManager.dispatch(new Example.aUnknownValueAction(''));
    }).toThrow(new UnknownAction('aUnknownValueAction'));
  })

  afterEach(() => {
    onChangeSpy.mockReset();
    consoleLogSpy.mockReset();
    consoleGroupBeginSpy.mockReset();
    consoleGroupEndSpy.mockReset();
    setLocalStorageSpy.mockReset();
  })
});
