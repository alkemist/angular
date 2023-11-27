import { NgModule } from '@angular/core';
import { StateManagerComponent } from './state-manager.component';
import { StateManager } from './state-manager.service';


@NgModule({
  declarations: [
    StateManagerComponent
  ],
  providers: [
    StateManager
  ],
  imports: [],
  exports: [
    StateManagerComponent
  ]
})
export class StateManagerModule {
}
