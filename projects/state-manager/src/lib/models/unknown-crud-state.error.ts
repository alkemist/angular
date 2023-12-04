export class UnknownCrudState extends Error {
  constructor(stateKey: string) {
    super(`Crud state "${ stateKey }" not configured`);
  }
}
