import { ValueRecord } from '@alkemist/smart-tools'
import { Action, Select, State, StateContext, StateExtend } from '@alkemist/ngx-state-manager';
import { GroupInterface } from './group.interface';
import { Group as GroupAction } from "./group.action";
import { UserInterface } from '../user';


interface GroupStateInterface extends ValueRecord {
  all: GroupInterface[]
}

namespace Group {
  @State({
    defaults: <GroupStateInterface>{
      all: []
    },
    showLog: true,
    enableLocalStorage: true
  })
  export class Store extends StateExtend {
    //static override stateKey = 'Groups';
    stateKey = 'Groups';

    @Select('all')
    static groups(state: GroupStateInterface): GroupInterface[] {
      return state.all;
    }

    @Action(GroupAction.ActionAdd)
    addGroup(context: StateContext<GroupStateInterface>, payload: GroupInterface) {
      context.addItem('all', payload);
    }

    @Action(GroupAction.ActionReset)
    reset(context: StateContext<GroupStateInterface>, payload: UserInterface) {
      context.patchState({
        all: [],
      })
    }
  }
}

export { Group };
