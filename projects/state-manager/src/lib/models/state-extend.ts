export abstract class StateExtend {
  static stateKey: string;
  abstract stateKey: string;
}

export type StateClass<C extends StateExtend> = {
  stateKey: string;

  new(): C
}
