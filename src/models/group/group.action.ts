import { GroupInterface } from './group.interface';

namespace Group {
  export class ActionAdd {
    static readonly log = "Add";

    constructor(public payload: GroupInterface) {
    }
  }

  export class ActionReset {
    static readonly log = "Reset";

    constructor() {
    }
  }
}

export { Group };
