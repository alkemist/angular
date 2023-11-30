export class UnknownState extends Error {
  constructor(stateKey: string) {
    super(`Unknown state "${ stateKey }"`);
  }
}
