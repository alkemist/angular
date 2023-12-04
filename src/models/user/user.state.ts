import { StateCrudData, StateCrudDefinition, StateCrudExtend } from '@alkemist/ngx-state-manager';
import { UserInterface } from './user.interface';


interface UserStateInterface extends StateCrudData<UserInterface> {

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
  export class State extends StateCrudExtend<State, UserStateInterface, UserInterface> {
    override stateKey = 'Users';
  }
}

export { User };
