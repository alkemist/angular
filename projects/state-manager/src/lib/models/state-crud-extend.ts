import { StateExtend } from './state-extend';
import { StateCrud } from './state-crud.interface';
import { StateCrudContext } from './state-crud-context';

export const stateCrudAdd =
  <S extends StateCrud<I>, I>
  (context: StateCrudContext<S, I>, payload: I) => {
    context.addItem('all', payload);
  }

export const stateCrudRemove = <S extends StateCrud<I>, I>
(context: StateCrudContext<S, I>, payload: I) => {
  context.removeItem('all', payload)
};

export class ActionAdd<I> {
  static readonly log = "Add";

  constructor(public payload: I) {
  }
}

export abstract class StateCrudExtend<C extends StateExtend, S extends StateCrud<I>, I> extends StateExtend {
  remove = stateCrudRemove;

  add = stateCrudAdd;

  fill(context: StateCrudContext<S, I>, payload: I[]) {
    context.patchState({
      all: payload
    } as Partial<S>)
  }

  reset(context: StateCrudContext<S, I>) {
    context.patchState({
      all: [] as I[]
    } as Partial<S>)
  }
}
