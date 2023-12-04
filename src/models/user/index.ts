export * from './user.interface'

import { User as UserStore } from './user.state'
import { User as UserModel } from './user.model'

export namespace User {

  export class Model extends UserModel.Model {

  }

  export class State extends UserStore.State {

  }
}
