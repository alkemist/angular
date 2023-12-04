import { TreeHelper, TypeHelper, ValueKey, ValueRecord } from "@alkemist/smart-tools";
import { CompareEngine } from '@alkemist/compare-engine';
import { UndefinedDetermineArrayIndexFnError } from './undefined-determine-array-index-fn-error';

export class StateContext<DATA extends ValueRecord, ITEM = any> {
  constructor(protected stateKey: string, protected compareEngine: CompareEngine<DATA>, protected determineArrayIndexFn?: ((paths: ValueKey[]) => ValueKey | ValueKey[])) {

  }

  getState(): DATA {
    return <DATA>this.compareEngine.rightValue;
  }

  setState(val: DATA) {
    this.compareEngine.updateRight(val);
    this.compareEngine.updateCompareIndex();
  }

  setInState(paths: ValueKey[] | ValueKey, val: any) {
    this.compareEngine.updateInRight(val, paths);
    this.compareEngine.updateCompareIndex();
  }

  patchState(val: Partial<DATA>) {
    this.setState({
      ...this.getState(),
      ...val
    });
  }

  patchInState(paths: ValueKey[] | ValueKey, val: any) {
    const currentVal = this.getItems(paths);
    this.compareEngine.updateInRight({
      ...currentVal,
      ...val
    }, paths);
  }

  addItem(paths: ValueKey[] | ValueKey, item: ITEM) {
    const _items = this.getItems(paths);
    _items.push(item);
    return this.setItems(paths, _items);
  }

  addItems(paths: ValueKey[] | ValueKey, items: ITEM[]) {
    const _items = this.getItems(paths);
    _items.push(...items);
    return this.setItems(paths, _items);
  }

  replaceItem(paths: ValueKey | ValueKey[], itemToReplace: ITEM) {
    const compareValue = this.determineCompareValue(paths, itemToReplace);

    return this.remplaceOneItem(paths,
      (item) =>
        compareValue === this.determineCompareValue(paths, item),
      itemToReplace
    )
  }

  remplaceOneItem(paths: ValueKey[] | ValueKey, selector: (item: ITEM) => boolean, item: ITEM) {
    const _items = this.getItems(paths);
    const items = _items.map(_item => selector(_item) ? item : _item);
    return this.setItems(paths, items);
  }

  patchItem(paths: ValueKey | ValueKey[], itemToPatch: Partial<ITEM>) {
    const compareValue = this.determineCompareValue(paths, itemToPatch);

    return this.patchOneItem(paths,
      (item) =>
        compareValue === this.determineCompareValue(paths, item),
      itemToPatch
    )
  }

  patchOneItem(paths: ValueKey[] | ValueKey, selector: (item: ITEM) => boolean, item: Partial<ITEM>) {
    const _items = this.getItems(paths);
    const items = _items.map(_item => selector(_item) ? {
      ..._item,
      ...item
    } : _item);
    return this.setItems(paths, items);
  }

  removeItem(paths: ValueKey | ValueKey[], itemToRemove: ITEM) {
    const compareValue = this.determineCompareValue(paths, itemToRemove);

    return this.removeOneItem(paths,
      (item) =>
        compareValue === this.determineCompareValue(paths, item)
    )
  }

  removeOneItem(paths: ValueKey[] | ValueKey, selector: (item: ITEM) => boolean) {
    const _items = this.getItems(paths);
    const items = _items.filter(item => !selector(item));
    return this.setItems(paths, items);
  }

  protected getItems(paths: ValueKey[] | ValueKey) {
    return this.compareEngine.getInRight<ITEM[]>(paths);
  }

  protected setItems<T>(paths: ValueKey[] | ValueKey, items: T[]) {
    this.compareEngine.updateInRight(items, paths);
    return items;
  }

  protected determineCompareValue(_paths: ValueKey | ValueKey[], item: ITEM | Partial<ITEM>) {
    const paths = TypeHelper.isArray(_paths) ? _paths : [ _paths ];
    let compareValue: unknown | ITEM = item;

    if (!this.determineArrayIndexFn) {
      throw new UndefinedDetermineArrayIndexFnError(this.stateKey);
    }

    const _idPath = this.determineArrayIndexFn(paths);
    const idPath = TypeHelper.isArray(_idPath) ? _idPath : [ _idPath ];

    compareValue = TreeHelper.getIn(item, idPath);

    return compareValue;
  }
}
