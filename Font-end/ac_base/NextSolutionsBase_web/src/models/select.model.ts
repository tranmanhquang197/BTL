export class SelectModel {
  value: any;
  displayValue: string;
  disabled: boolean | undefined;
  rawData: any;

  constructor(value: any, displayValue: string, disabled?: boolean, rawData?: any) {
    this.value = value;
    this.displayValue = displayValue;
    this.disabled = disabled;
    this.rawData = rawData;
  }
}
