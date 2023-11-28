export class UnknownSelect extends Error {
  constructor(selectKey: string) {
    super(`Unknown select "${ selectKey }"`);
  }
}
