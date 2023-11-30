import { StateCrud, StateCrudDefinition, StateCrudExtend, StateSelect } from '@alkemist/ngx-state-manager';
import { UserInterface } from './user.interface';


interface UserStateInterface extends StateCrud<UserInterface> {
  all: UserInterface[]
}

namespace User {
  @StateCrudDefinition({
    defaults: <UserStateInterface>{
      all: []
    },
    determineArrayIndexFn: () => 'id',
    showLog: true,
    enableLocalStorage: true
  })
  export class Store extends StateCrudExtend<Store, UserStateInterface, UserInterface> {
    override stateKey = 'Users';

    @StateSelect('all')
    static users(state: UserStateInterface): UserInterface[] {
      return state.all;
    }

    /*@StateAction(UserAction.ActionAdd)
    override add(context: StateCrudContext<UserStateInterface, UserInterface>, payload: UserInterface) {
      super.add(context, payload);
    }

    @StateAction(UserAction.ActionReset)
    override reset(context: StateCrudContext<UserStateInterface, UserInterface>) {
      super.reset(context)
    }*/
  }
}

export { User };
