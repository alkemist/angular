export class UnknownAction extends Error {
  constructor(actionKey: string) {
    super(`Unknown action "${ actionKey }"`);
  }
}
