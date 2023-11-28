import { NgModule } from '@angular/core';
import { StateManagerComponent } from './state-manager.component';


@NgModule({
  declarations: [
    StateManagerComponent
  ],
  providers: [],
  imports: [],
  exports: [
    StateManagerComponent
  ]
})
export class StateManagerModule {
  /*constructor(@Optional() @SkipSelf() parentModule?: StateManagerModule) {
    if (parentModule) {
      throw new Error(
        'StateManagerModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(configuration: StateManagerConfiguration<any>): ModuleWithProviders<StateManagerModule> {
    console.log('module configuration', configuration)

    return {
      ngModule: StateManagerModule,
      providers: [
        { provide: StateManager, useValue: configuration }
      ]
    };
  }*/
}
