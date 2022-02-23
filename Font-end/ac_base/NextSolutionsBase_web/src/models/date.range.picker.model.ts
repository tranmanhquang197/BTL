export class DateRangePickerModel {
  fromDate: any = '';
  toDate: any = '';

  constructor(fromDate?: any, toDate?: any) {
    this.fromDate = fromDate ? fromDate : '';
    this.toDate = toDate ? toDate : '';
  }

  isString(inputValue: any): boolean {
    return typeof inputValue === 'string' || inputValue instanceof String;
  }

  reset() {
    this.toDate = '';
    this.fromDate = '';
  }

}
