import { StateExtend } from './state-extend';
import { StateCrud } from './state-crud.interface';
import { generateStateCrudFunctions } from './state-crud-functions.const';

export abstract class StateCrudExtend<C extends StateExtend, S extends StateCrud<I>, I> extends StateExtend {
  fill = generateStateCrudFunctions().fill;
  add = generateStateCrudFunctions().add;
  replace = generateStateCrudFunctions().replace;
  update = generateStateCrudFunctions().update;
  remove = generateStateCrudFunctions().remove;
  reset = generateStateCrudFunctions().reset
}
