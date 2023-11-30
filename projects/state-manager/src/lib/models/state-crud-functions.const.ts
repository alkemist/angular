import { StateCrud } from './state-crud.interface';
import { StateCrudContext } from './state-crud-context';
import { StateCrudActionEnum } from './state-crud-action.type';
import { StateActionFunction } from './state-action-function.type';

export const generateStateCrudFunctions =
  <STATE extends StateCrud<I>, CONTEXT extends StateCrudContext<STATE, I>, I>():
    Record<StateCrudActionEnum, StateActionFunction<STATE, CONTEXT>> => {
    return {
      [StateCrudActionEnum.Fill]:
        <STATE extends StateCrud<I>, I>
        (context: StateCrudContext<STATE, I>, payload: I[]) => {
          context.patchState({
            all: payload
          } as Partial<STATE>);
        },

      [StateCrudActionEnum.Add]:
        <S extends StateCrud<I>, I>
        (context: StateCrudContext<S, I>, payload: I) => {
          context.addItem('all', payload);
        },

      [StateCrudActionEnum.Replace]:
        <S extends StateCrud<I>, I>
        (context: StateCrudContext<S, I>, payload: I) => {
          context.replaceItem('all', payload)
        },

      [StateCrudActionEnum.Update]:
        <S extends StateCrud<I>, I>
        (context: StateCrudContext<S, I>, payload: Partial<I>) => {
          context.patchItem('all', payload)
        },

      [StateCrudActionEnum.Remove]:
        <S extends StateCrud<I>, I>
        (context: StateCrudContext<S, I>, payload: I) => {
          context.removeItem('all', payload)
        },

      [StateCrudActionEnum.Reset]:
        <S extends StateCrud<I>, I>
        (context: StateCrudContext<S, I>, payload: I) => {
          context.patchState({
            all: [] as I[]
          } as Partial<S>)
        }
    }
  }
