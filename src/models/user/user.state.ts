import { StateCrud, StateCrudDefinition, StateCrudExtend, StateSelect } from '@alkemist/ngx-state-manager';
import { UserInterface } from './user.interface';


interface UserStateInterface extends StateCrud<UserInterface> {

}

namespace User {
  @StateCrudDefinition({
    defaults: {
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
  }
}

export { User };
