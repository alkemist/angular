import { UserInterface } from './user.interface';

namespace User {
  export class ActionAdd {
    static readonly log = "Add";

    constructor(public payload: UserInterface) {
    }
  }

  export class ActionReset {
    static readonly log = "Reset";

    constructor() {
    }
  }
}

export { User };
