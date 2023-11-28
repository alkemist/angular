export * from './user.interface'

import { User as UserStore } from './user.state'
import { User as UserAction } from './user.action'
import { User as UserModel } from './user.model'

export module User {

  export class Model extends UserModel.Model {

  }

  export class Store extends UserStore.Store {

  }

  export class ActionAdd extends UserAction.ActionAdd {

  }

  export class ActionReset extends UserAction.ActionReset {

  }
}
