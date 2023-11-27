import { Component, WritableSignal } from '@angular/core';
import { StateManager } from '@alkemist/ngx-state-manager';
import { Observe } from '@alkemist/ngx-state-manager/src/lib/decorators/state-observe.decorator';
import { UserInterface } from '@alkemist/ngx-state-manager/test/test-data';
import { User } from '../models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  @Observe(User.Store, User.Store.users)
  users!: WritableSignal<UserInterface[]>;

  constructor(private store: StateManager) {


  }
}
