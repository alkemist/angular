export class UndefinedDetermineArrayIndexFnError extends Error {
  constructor(actionKey: string) {
    super(`Undefined DetermineArrayIndexFn for "${ actionKey }"`);
  }
}
