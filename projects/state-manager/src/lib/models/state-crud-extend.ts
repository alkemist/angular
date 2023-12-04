import { StateExtend } from './state-extend';
import { StateCrudData } from './state-crud-data.interface';
import { generateStateCrudSelects } from './state-crud-selects.const';

export abstract class StateCrudExtend<STATE extends StateExtend, DATA extends StateCrudData<ITEM>, ITEM> extends StateExtend {
  static all = generateStateCrudSelects().all
  static lastUpdated = generateStateCrudSelects().lastUpdated
}
