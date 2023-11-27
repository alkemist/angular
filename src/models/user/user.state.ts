/// <reference path="user.interface.ts" />
import { ValueRecord } from '@alkemist/smart-tools'
import { Select } from '@alkemist/ngx-state-manager/src/lib/decorators/state-select.decorator';
import { Action } from '@alkemist/ngx-state-manager/src/lib/decorators/state-action.decorator';
import { StateContext } from '@alkemist/ngx-state-manager/src/lib/models/state.context';
import { State } from '@alkemist/ngx-state-manager/src/lib/decorators/state.decorator';
import { UserInterface } from './user.interface';
import { User as _User } from './user.action'

export interface UserStateInterface extends ValueRecord {
  users: UserInterface[]
}

namespace User {
  export const ActionAdd = _User.Actions.Add;

  @State({
    name: 'Users',
    class: Store,
    defaults: <UserStateInterface>{
      users: []
    },
    showLog: true,
    enableLocalStorage: true
  })
  export class Store {
    @Select('users')
    static users(state: UserStateInterface): UserInterface[] {
      return state.users;
    }

    @Action(ActionAdd)
    aStringValueAction(context: StateContext<UserStateInterface>, payload: string) {
      context.patchState({
        aStringValue: payload
      })
    }
  }
}


