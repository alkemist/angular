export class NotInitializedStateError extends Error {
  constructor(stateKey: string) {
    super(`Not initialized state "${ stateKey }"`);
  }
}
