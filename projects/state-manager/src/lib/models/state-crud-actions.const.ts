import { StateCrudData } from './state-crud-data.interface';
import { StateCrudContext } from './state-crud-context';
import { StateCrudActionEnum } from './state-crud-action.type';
import { StateActionFunction } from './state-action-function.type';

export const generateStateCrudActions =
  <DATA extends StateCrudData<ITEM>, CONTEXT extends StateCrudContext<DATA, ITEM>, ITEM>():
    Record<StateCrudActionEnum, StateActionFunction<DATA, CONTEXT>> => ({
    [StateCrudActionEnum.Fill]:
      (context: StateCrudContext<DATA, ITEM>, payload: ITEM[]) => {
        context.patchState({
          all: payload,
          lastUpdated: new Date(),
        } as Partial<DATA>);
      },

    [StateCrudActionEnum.Add]:
      (context: StateCrudContext<DATA, ITEM>, payload: ITEM) => {
        context.addItem('all', payload);
        context.patchState({
          lastUpdated: new Date(),
        } as Partial<DATA>);
      },

    [StateCrudActionEnum.Replace]:
      (context: StateCrudContext<DATA, ITEM>, payload: ITEM) => {
        context.replaceItem('all', payload);
        context.patchState({
          lastUpdated: new Date(),
        } as Partial<DATA>);
      },

    [StateCrudActionEnum.Update]:
      (context: StateCrudContext<DATA, ITEM>, payload: Partial<ITEM>) => {
        context.patchItem('all', payload);
        context.patchState({
          lastUpdated: new Date(),
        } as Partial<DATA>);
      },

    [StateCrudActionEnum.Remove]:
      (context: StateCrudContext<DATA, ITEM>, payload: ITEM) => {
        context.removeItem('all', payload);
        context.patchState({
          lastUpdated: new Date(),
        } as Partial<DATA>);
      },

    [StateCrudActionEnum.Reset]:
      (context: StateCrudContext<DATA, ITEM>) => {
        context.patchState({
          all: [] as ITEM[],
          lastUpdated: null,
        } as Partial<DATA>)
      }
  })

