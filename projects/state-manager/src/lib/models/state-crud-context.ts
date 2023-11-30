import { TreeHelper, TypeHelper, ValueKey } from "@alkemist/smart-tools";
import { CompareEngine } from '@alkemist/compare-engine';
import { StateCrud } from './state-crud.interface';
import { StateContext } from './state-context';

export class StateCrudContext<S extends StateCrud<I>, I> extends StateContext<S, I> {

  constructor(state: CompareEngine<S>, private determineArrayIndexFn?: ((paths: ValueKey[]) => ValueKey | ValueKey[])) {
    super(state);
  }

  replaceItem(paths: ValueKey | ValueKey[], itemToReplace: I) {
    const compareValue = this.determineCompareValue(paths, itemToReplace);

    return super.remplaceOneItem(paths,
      (item) =>
        compareValue === this.determineCompareValue(paths, item),
      itemToReplace
    )
  }

  patchItem(paths: ValueKey | ValueKey[], itemToPatch: Partial<I>) {
    const compareValue = this.determineCompareValue(paths, itemToPatch);

    return super.patchOneItem(paths,
      (item) =>
        compareValue === this.determineCompareValue(paths, item),
      itemToPatch
    )
  }

  removeItem(paths: ValueKey | ValueKey[], itemToRemove: I) {
    const compareValue = this.determineCompareValue(paths, itemToRemove);

    return super.removeOneItem(paths,
      (item) =>
        compareValue === this.determineCompareValue(paths, item)
    )
  }

  private determineCompareValue(_paths: ValueKey | ValueKey[], item: I | Partial<I>) {
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
