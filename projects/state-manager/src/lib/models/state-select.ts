import { StateSelectFunction } from './state-select-function.type';
import { SmartMap, ValueKey, ValueRecord } from '@alkemist/smart-tools';
import { WritableSignal } from "@angular/core";

export class StateSelect<DATA extends ValueRecord, ITEM = any> {
  private observers = new SmartMap<WritableSignal<ITEM>>()

  constructor(private selectFunction: StateSelectFunction<DATA, ITEM>, private _path?: ValueKey | ValueKey[]) {
  }

  get path() {
    return this._path;
  }

  addObserver(observerKey: string, observer: WritableSignal<ITEM>) {
    this.observers.set(observerKey, observer);
    return this;
  }

  getValue(state: DATA) {
    return this.selectFunction.apply(this.selectFunction, [
      state
    ]) as ITEM;
  }

  update(state: DATA) {
    this.observers.each(
      (observer) => observer.set(this.getValue(state))
    )
  }
}
