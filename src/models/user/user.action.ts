/// <reference path="user.interface.ts" />

import { UserInterface } from './user.interface';

namespace User {
  export namespace Actions {
    export class Add {
      static readonly log = "Add user";

      constructor(public payload: UserInterface) {
      }
    }
  }
}
