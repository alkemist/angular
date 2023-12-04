import { StateCrudData } from './state-crud-data.interface';
import { StateCrudSelectEnum } from './state-crud-select.type';
import { StateSelectFunction } from './state-select-function.type';

export const generateStateCrudSelects =
  <STATE extends StateCrudData<I>, I>():
    Record<StateCrudSelectEnum, StateSelectFunction<STATE, I[]>> => ({
    [StateCrudSelectEnum.All]: (state: STATE) => {
      return state.all;
    },
    [StateCrudSelectEnum.LastUpdated]: (state: STATE) => {
      return state.lastUpdated;
    }
  });
