export class ButtonClickModel {
  action: string;
  object: any;
  index: number | null | undefined;

  constructor(action: string, object: any, index?: number | null) {
    this.action = action;
    this.object = object;
    this.index = index;
  }
}
