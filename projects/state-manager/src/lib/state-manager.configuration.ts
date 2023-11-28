import { Type } from '@angular/core';

export class StateManagerConfiguration<T extends Type<Object>> {
  states: T[] = [];
}
