import { TreeHelper, TypeHelper, ValueKey } from "@alkemist/smart-tools";
import { CompareEngine } from '@alkemist/compare-engine';
import { StateCrud } from './state-crud.interface';
import { StateContext } from './state-context';

export class StateCrudContext<S extends StateCrud<I>, I> extends StateContext<S, I> {

  constructor(state: CompareEngine<S>, private determineArrayIndexFn?: ((paths: ValueKey[]) => ValueKey | ValueKey[])) {
    super(state);
  }

  removeItem(paths: ValueKey | ValueKey[], itemToRemove: I) {
    const compareValue = this.determineCompareValue(paths, itemToRemove);

    return super.removeOneItem(paths, (item) => compareValue === this.determineCompareValue(paths, item))
  }

  private determineCompareValue(_paths: ValueKey | ValueKey[], item: I) {
    const paths = TypeHelper.isArray(_paths) ? _paths : [ _paths ];
    let compareValue: unknown | I = item;

    if (this.determineArrayIndexFn) {
      const _idPath = this.determineArrayIndexFn(paths);
      const idPath = TypeHelper.isArray(_idPath) ? _idPath : [ _idPath ];

      compareValue = TreeHelper.getIn(item, idPath);
    }

    return compareValue;
  }
}
