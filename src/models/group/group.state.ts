import { ValueRecord } from '@alkemist/smart-tools'
import { StateAction, StateContext, StateDefinition, StateExtend, StateSelect } from '@alkemist/ngx-state-manager';
import { GroupInterface } from './group.interface';
import { Group as GroupAction } from "./group.action";
import { UserInterface } from '../user';


interface GroupStateInterface extends ValueRecord {
  all: GroupInterface[]
}

namespace Group {
  @StateDefinition({
    defaults: <GroupStateInterface>{
      all: []
    },
    showLog: true,
    enableLocalStorage: true
  })
  export class Store extends StateExtend {
    stateKey = 'Groups';

    @StateSelect('all')
    static groups(state: GroupStateInterface): GroupInterface[] {
      return state.all;
    }

    @StateAction(GroupAction.ActionAdd)
    addGroup(context: StateContext<GroupStateInterface>, payload: GroupInterface) {
      context.addItem('all', payload);
    }

    @StateAction(GroupAction.ActionReset)
    reset(context: StateContext<GroupStateInterface>, payload: UserInterface) {
      context.patchState({
        all: [],
      })
    }
  }
}

export { Group };
