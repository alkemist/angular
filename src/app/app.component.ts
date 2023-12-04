import { Component, WritableSignal } from '@angular/core';
import { StateManagerService, StateObserve } from '@alkemist/ngx-state-manager';
import { User, UserInterface } from '../models/user';
import { Group, GroupInterface } from '../models/group';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  @StateObserve(User.State, User.State.all)
  users!: WritableSignal<UserInterface[]>;

  @StateObserve(Group.State, Group.State.groups)
  groups!: WritableSignal<GroupInterface[]>;

  constructor(private store: StateManagerService) {
  }

  addUser() {
    const id = this.users().length + 1;
    const user = {
      id,
      name: `username ${ id }`
    };

    this.store.dispatchAdd(User.State, user);
  }

  removeUser(user: User.Model) {
    this.store.dispatchRemove(User.State, user);
  }

  addGroup() {
    const id = this.groups().length + 1;
    const group = {
      id,
      name: `group ${ id }`
    };

    this.store.dispatch(Group.State, new Group.ActionAdd(group))
  }

  resetUsers() {
    this.store.dispatchReset(User.State)
  }

  resetGroups() {
    this.store.dispatch(Group.State, new Group.ActionReset())
  }

  debugUsers() {
    console.log("Users", this.store.debug(User.State));
  }

  debugGroups() {
    console.log("Groups", this.store.debug(Group.State));
  }
}
