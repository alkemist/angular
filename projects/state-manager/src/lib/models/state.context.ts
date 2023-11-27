import { ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { CompareEngine } from '@alkemist/compare-engine';

export class StateContext<S extends ValueRecord> {

  constructor(private state: CompareEngine<S>) {

  }

  getState(): S {
    return <S>this.state.rightValue;
  }

  setState(val: S) {
    this.state.updateRight(val);
    this.state.updateCompareIndex();
  }

  setInState(paths: ValueKey[] | ValueKey, val: unknown) {
    this.state.updateInRight(val, paths);
    this.state.updateCompareIndex();
  }

  patchState(val: Partial<S>) {
    this.setState({
      ...this.getState(),
      ...val
    });
  }

  patchInState<T>(paths: ValueKey[] | ValueKey, val: T) {
    const currentVal = this.getItems<T>(paths);
    this.state.updateInRight({
      ...currentVal,
      ...val
    }, paths);
  }

  addItem<T>(paths: ValueKey[] | ValueKey, item: T) {
    const _items = this.getItems<T>(paths);
    _items.push(item);
    return this.setItems(paths, _items);
  }

  addItems<T>(paths: ValueKey[] | ValueKey, items: T[]) {
    const _items = this.getItems<T>(paths);
    _items.push(...items);
    return this.setItems(paths, _items);
  }

  setItem<T>(paths: ValueKey[] | ValueKey, selector: (item: T) => boolean, item: T) {
    const _items = this.getItems<T>(paths);
    const items = _items.map(_item => selector(_item) ? item : _item);
    return this.setItems(paths, items);
  }

  patchItem<T>(paths: ValueKey[] | ValueKey, selector: (item: T) => boolean, item: Partial<T>) {
    const _items = this.getItems<T>(paths);
    const items = _items.map(_item => selector(_item) ? {
      ..._item,
      ...item
    } : _item);
    return this.setItems(paths, items);
  }

  removeItem<T>(paths: ValueKey[] | ValueKey, selector: (item: T) => boolean) {
    const _items = this.getItems<T>(paths);
    const items = _items.filter(item => !selector(item));
    return this.setItems(paths, items);
  }

  private getItems<T>(paths: ValueKey[] | ValueKey) {
    return this.state.getInRight<T[]>(paths);
  }

  private setItems<T>(paths: ValueKey[] | ValueKey, items: T[]) {
    this.state.updateInRight(items, paths);
    return items;
  }
}