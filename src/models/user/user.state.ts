import { ValueRecord } from '@alkemist/smart-tools'
import { Action, Select, State, StateContext, StateExtend } from '@alkemist/ngx-state-manager';
import { UserInterface } from './user.interface';
import { User as UserAction } from "./user.action";


interface UserStateInterface extends ValueRecord {
  all: UserInterface[]
}

namespace User {
  @State({
    defaults: <UserStateInterface>{
      all: []
    },
    showLog: true,
    enableLocalStorage: true
  })
  export class Store extends StateExtend {
    static override stateKey = 'Users';
    override stateKey = 'Users';

    constructor() {
      super();
    }

    @Select('all')
    static users(state: UserStateInterface): UserInterface[] {
      return state.all;
    }

    @Action(UserAction.ActionAdd)
    addUser(context: StateContext<UserStateInterface>, payload: UserInterface) {
      context.addItem('all', payload);
    }

    @Action(UserAction.ActionReset)
    reset(context: StateContext<UserStateInterface>, payload: UserInterface) {
      context.patchState({
        all: [],
      })
    }
  }
}

export { User };
