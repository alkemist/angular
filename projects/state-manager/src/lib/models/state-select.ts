import { StateSelectFunction } from './state-select-function.type';
import { SmartMap, ValueKey, ValueRecord } from '@alkemist/smart-tools';
import { WritableSignal } from "@angular/core";

export class StateSelect<S extends ValueRecord, T = any> {
  private observers = new SmartMap<WritableSignal<T>>()

  constructor(private selectFunction: StateSelectFunction<S, T>, private _path?: ValueKey | ValueKey[]) {
  }

  get path() {
    return this._path;
  }

  addObserver(observerKey: string, observer: WritableSignal<T>) {
    this.observers.set(observerKey, observer);
    return this;
  }

  getValue(state: S) {
    return this.selectFunction.apply(this.selectFunction, [
      state
    ]);
  }

  update(state: S) {
    this.observers.each(
      (observer) => observer.set(this.getValue(state))
    )
  }
}
