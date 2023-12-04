export * from './group.interface'

import { Group as GroupStore } from './group.state'
import { Group as GroupAction } from './group.action'
import { Group as GroupModel } from './group.model'

export namespace Group {
  export class Model extends GroupModel.Model {

  }

  export class State extends GroupStore.State {

  }

  export class ActionAdd extends GroupAction.ActionAdd {

  }

  export class ActionReset extends GroupAction.ActionReset {

  }
}
