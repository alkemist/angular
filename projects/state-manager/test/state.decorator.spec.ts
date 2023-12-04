import {
  aBooleanValueDefault,
  anObjectValueDefault,
  aStringValueDefault,
  Example,
  ExampleComponent,
  ExampleState,
  exampleStorageName,
  UserInterface,
  UserService,
  UserState
} from './test-data.js';
import { StateManagerService } from '../src/lib/state-manager.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateManagerModule } from '../index';
import { UnknownAction } from '../src/lib/models/unknown-action.error';
import { effect, Injector } from '@angular/core';

describe("State Decorator", () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;
  let stateManager: StateManagerService;
  let injector: Injector;

  let onChangeSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleGroupBeginSpy: jest.SpyInstance;
  let consoleGroupEndSpy: jest.SpyInstance;
  let setLocalStorageSpy: jest.SpyInstance;
  let getLocalStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ExampleComponent, StateManagerModule ],
      providers: [
        UserService
      ]
    });
    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    stateManager = TestBed.inject(StateManagerService);
    injector = TestBed.inject(Injector);

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleGroupBeginSpy = jest.spyOn(console, 'group').mockImplementation();
    consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();

    setLocalStorageSpy = jest.spyOn(localStorage, 'setItem');
    getLocalStorageSpy = jest.spyOn(localStorage, 'getItem');

    onChangeSpy = jest.spyOn(component, 'onChange');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('basic state', () => {
    const aStringValueTest = 'test';
    const aObjectValueTest: UserInterface = {
      name: 'user test',
      id: 1
    }

    it('should dispatch string', () => {
      let aStringValueEffect = '';

      effect(
        () => {
          aStringValueEffect = component.aStringValueObserver();
        },
        { injector }
      );
      fixture.detectChanges();

      expect(component.aStringValueObserver()).toEqual(aStringValueDefault);
      expect(component.getStringValue()).toEqual(aStringValueDefault);
      expect(component.aStringValueComputed()).toEqual(aStringValueDefault);
      expect(component.aBooleanValueObserver()).toEqual(aBooleanValueDefault);
      expect(aStringValueEffect).toEqual(aStringValueDefault);
      expect(onChangeSpy).toBeCalledTimes(1);

      onChangeSpy.mockReset();
      setLocalStorageSpy.mockReset();
      component.dispatchStringValue(aStringValueTest);
      fixture.detectChanges();

      expect(component.aStringValueObserver()).toEqual(aStringValueTest);
      expect(component.getStringValue()).toEqual(aStringValueTest);
      expect(component.aStringValueComputed()).toEqual(aStringValueTest);
      expect(aStringValueEffect).toEqual(aStringValueTest);
      expect(onChangeSpy).toBeCalledTimes(1);
      expect(setLocalStorageSpy).toBeCalledTimes(1);
      expect(setLocalStorageSpy).toBeCalledWith(exampleStorageName,
        `{` +
        `\"aStringValue\":\"${ aStringValueTest }\",` +
        `\"anObjectValue\":${ anObjectValueDefault },` +
        `\"aBooleanValue\":${ aBooleanValueDefault }` +
        `}`
      );

      onChangeSpy.mockReset();
      component.dispatchStringValue(aStringValueTest);

      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(consoleGroupBeginSpy).toBeCalledTimes(2);
      expect(consoleGroupEndSpy).toBeCalledTimes(2);
      expect(consoleLogSpy).toBeCalledTimes(2 * 3);
      //})
    })

    it('should dispatch object', async () => {
      expect(component.anObjectValueObserver()).toEqual(anObjectValueDefault);

      await component.dispatchObjectValue(aObjectValueTest);

      expect(component.anObjectValueObserver()).toEqual(aObjectValueTest);
      expect(setLocalStorageSpy).toBeCalledTimes(1);
      expect(setLocalStorageSpy).toBeCalledWith(exampleStorageName,
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
        stateManager.dispatch(ExampleState, new Example.aUnknownValueAction(''));
      }).toThrow(new UnknownAction('aUnknownValueAction'));
    })
  })

  describe('crud state', () => {
    const user1: UserInterface = { id: 1, name: 'name 1', valid: true };
    const user2: UserInterface = { id: 2, name: 'name 2', valid: true };
    const user3: UserInterface = { id: 3, name: 'name 3', valid: true };
    const user3updated: UserInterface = { id: 3, name: 'name 3', valid: false };
    const user3replaced: UserInterface = { id: 3, name: 'name 3 bis' };
    let users: UserInterface[] = [];

    it('should fill', () => {
      effect(
        () => {
          users = component.users();
        },
        { injector }
      );
      fixture.detectChanges();

      expect(users).toEqual([]);
      expect(stateManager.selectAll(UserState)).toEqual([]);

      stateManager.dispatchFill(UserState, [ user1, user2 ]);
      fixture.detectChanges();

      expect(users).toEqual([ user1, user2 ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user2 ]);
    })

    it('should add', () => {
      effect(
        () => {
          users = component.users();
        },
        { injector }
      );
      fixture.detectChanges();

      expect(users).toEqual([ user1, user2 ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user2 ]);

      stateManager.dispatchAdd(UserState, user3);
      fixture.detectChanges();

      expect(users).toEqual([ user1, user2, user3 ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user2, user3 ]);
    });

    it('should remove', () => {
      effect(
        () => {
          users = component.users();
        },
        { injector }
      );
      fixture.detectChanges();

      expect(users).toEqual([ user1, user2, user3 ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user2, user3 ]);

      stateManager.dispatchRemove(UserState, user2);
      fixture.detectChanges();

      expect(users).toEqual([ user1, user3 ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user3 ]);
    });

    it('should update', () => {
      effect(
        () => {
          users = component.users();
        },
        { injector }
      );
      fixture.detectChanges();

      expect(users).toEqual([ user1, user3 ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user3 ]);

      stateManager.dispatchUpdate(UserState, { id: 3, valid: false });
      fixture.detectChanges();

      expect(users).toEqual([ user1, user3updated ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user3updated ]);
    });

    it('should replace', () => {
      effect(
        () => {
          users = component.users();
        },
        { injector }
      );
      fixture.detectChanges();

      expect(users).toEqual([ user1, user3updated ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user3updated ]);

      stateManager.dispatchReplace(UserState, user3replaced);
      fixture.detectChanges();

      expect(users).toEqual([ user1, user3replaced ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user3replaced ]);
    });

    it('should reset', () => {
      effect(
        () => {
          users = component.users();
        },
        { injector }
      );
      fixture.detectChanges();

      expect(users).toEqual([ user1, user3replaced ]);
      expect(stateManager.selectAll(UserState)).toEqual([ user1, user3replaced ]);

      stateManager.dispatchReset(UserState);
      fixture.detectChanges();

      expect(users).toEqual([]);
      expect(stateManager.selectAll(UserState)).toEqual([]);
    });
  });


  afterEach(() => {
    consoleLogSpy.mockReset();
    consoleGroupBeginSpy.mockReset();
    consoleGroupEndSpy.mockReset();
    setLocalStorageSpy.mockReset();

    onChangeSpy.mockReset();
  })
});
