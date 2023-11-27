import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StateManagerModule } from '@alkemist/ngx-state-manager';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StateManagerModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
