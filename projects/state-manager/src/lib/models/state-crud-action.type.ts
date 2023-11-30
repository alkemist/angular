export enum StateCrudActionEnum {
  Fill = 'fill',
  Add = `add`,
  Replace = 'replace',
  Update = 'update',
  Remove = 'remove',
  Reset = 'reset'
}

export type StateCrudActionType =
  StateCrudActionEnum.Fill |
  StateCrudActionEnum.Add |
  StateCrudActionEnum.Replace |
  StateCrudActionEnum.Update |
  StateCrudActionEnum.Remove |
  StateCrudActionEnum.Reset;
