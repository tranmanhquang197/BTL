import {formatNumber} from '@angular/common';


export class NumericInputFormat  {
  locale = 'en';
  decimalMarker = ',';

  constructor(
              ) {

  }

  unformatValue(value: any){
    const regExp = new RegExp(`[^\\d${this.decimalMarker}-]`, 'g');
    // Separate value on before and after decimal marker
    const [integer, decimal] = value.replace(regExp, '').split(this.decimalMarker);

    // Send non localized value, with dot as decimalMarker to API
    return decimal ? integer.concat('.', decimal) : integer;
  }
  formatValue(value: any){
    if(value === null || value === undefined){
      return '';
    }
    value += '';
    const [thousandSeparator, decimalMarker] = formatNumber(1000.99, this.locale).replace(/\d/g, '');
    this.decimalMarker = decimalMarker;

    // Here value should always come with . as decimal marker thus any other behavior is bug
    const [integer, decimal] = value.split('.');
    // console.log('4');
    // Group every three elements, and add thousandSeparator after them
    const v = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    return v;
  }

  //
  // private unFormatValue() {
  //   const value = this.element.nativeElement.value;
  //   if (this.isLastCharacterDecimalSeparator(value)) {
  //     return;
  //   }
  //   const regExp = new RegExp(`[^\\d${this.decimalMarker}-]`, 'g');
  //   const [integer, decimal] = value.replace(regExp, '').split(this.decimalMarker);
  //
  //   this._value = integer.concat('.', decimal);
  //   if (value) {
  //     this.element.nativeElement.value = this._value;
  //   } else {
  //     this.element.nativeElement.value = '';
  //   }
  // }
}
