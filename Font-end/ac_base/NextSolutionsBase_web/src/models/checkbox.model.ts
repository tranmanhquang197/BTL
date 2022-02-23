export class CheckboxModel {
  id: number;
  viewValue: string;
  checked: boolean;
  disabled: boolean | undefined;

  constructor(id: number, viewValue: string, checked: boolean, disabled?: boolean) {
    this.id = id;
    this.viewValue = viewValue;
    this.checked = checked;
    this.disabled = disabled;
  }
}
