class StateFactory {
  static factory<T extends StateFactory>(): T {
    return (new this) as T;
  }
}

export abstract class StateExtend extends StateFactory {
  abstract stateKey: string;

  static getStateKey(): string {
    return this.factory<StateExtend>().stateKey;
  }
}
