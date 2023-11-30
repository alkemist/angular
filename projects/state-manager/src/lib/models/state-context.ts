import { ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { CompareEngine } from '@alkemist/compare-engine';

export class StateContext<S extends ValueRecord, I = unknown> {

  constructor(protected state: CompareEngine<S>) {

  }

  getState(): S {
    return <S>this.state.rightValue;
  }

  setState(val: S) {
    this.state.updateRight(val);
    this.state.updateCompareIndex();
  }

  setInState(paths: ValueKey[] | ValueKey, val: I) {
    this.state.updateInRight(val, paths);
    this.state.updateCompareIndex();
  }

  patchState(val: Partial<S>) {
    this.setState({
      ...this.getState(),
      ...val
    });
  }

  patchInState(paths: ValueKey[] | ValueKey, val: I) {
    const currentVal = this.getItems(paths);
    this.state.updateInRight({
      ...currentVal,
      ...val
    }, paths);
  }

  addItem(paths: ValueKey[] | ValueKey, item: I) {
    const _items = this.getItems(paths);
    _items.push(item);
    return this.setItems(paths, _items);
  }

  addItems(paths: ValueKey[] | ValueKey, items: I[]) {
    const _items = this.getItems(paths);
    _items.push(...items);
    return this.setItems(paths, _items);
  }

  setItem(paths: ValueKey[] | ValueKey, selector: (item: I) => boolean, item: I) {
    const _items = this.getItems(paths);
    const items = _items.map(_item => selector(_item) ? item : _item);
    return this.setItems(paths, items);
  }

  patchItem(paths: ValueKey[] | ValueKey, selector: (item: I) => boolean, item: Partial<I>) {
    const _items = this.getItems(paths);
    const items = _items.map(_item => selector(_item) ? {
      ..._item,
      ...item
    } : _item);
    return this.setItems(paths, items);
  }

  removeOneItem(paths: ValueKey[] | ValueKey, selector: (item: I) => boolean) {
    const _items = this.getItems(paths);
    const items = _items.filter(item => !selector(item));
    return this.setItems(paths, items);
  }

  protected getItems(paths: ValueKey[] | ValueKey) {
    return this.state.getInRight<I[]>(paths);
  }

  protected setItems<T>(paths: ValueKey[] | ValueKey, items: T[]) {
    this.state.updateInRight(items, paths);
    return items;
  }
}
