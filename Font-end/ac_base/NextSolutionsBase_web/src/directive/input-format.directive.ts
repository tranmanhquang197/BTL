import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

@Directive({
    selector: '[inputDirective]',
    providers: [
        {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: InputFormatDirective},
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputFormatDirective),
            multi: true
        }
    ]
})
export class InputFormatDirective implements ControlValueAccessor {

    elementInput: any;
    control?: any;
    @Input('inputDirective') inputDirective: any;

    constructor(protected element: ElementRef<HTMLInputElement>,
    ) {

    }

    protected _value: string | null = '';

    get value(): string | null {
        return this._value;
    }

    @Input('value')
    set value(value: string | null) {
        this._value = value;
        this.format(value);
    }

    @HostListener('input', ['$event.target.value'])
    input(value: any) {
  //      console.log(value)

        // If decimal separator is last character don't update
        // because it will delete . || ,
        /*
                if (this.isLastCharacterDecimalSeparator(value)) {
                    this._value = value;
                } else {
                    this._value = this.unformatValue(value)
                }
        */

        // here to notify Angular Validators
        this._onChange(value);
//        this.format(this._value);
    }

    @HostListener('focusout', ['$event.target.value'])
    focusout(value: any) {
        console.log(value)

        // If decimal separator is last character don't update
        // because it will delete . || ,
        if (this.isLastCharacterDecimalSeparator(value)) {
            this._value = value;
        } else {
            this._value = this.unformatValue(value)
        }

        // here to notify Angular Validators
        this._onChange(this._value);
        this.format(this._value);
    }

/*
    @HostListener('blur')
    _onBlur() { 
        /!**
         * Adding thousand separators
         *!/
        this.format(this._value);
    }
*/


    _onChange(value: any): void {

    }

    /**
     * @param value
     * apply formatting on value assignment
     */
    writeValue(value: any) {
        this._value = value;
        this.format(this._value);
    }

    registerOnChange(fn: (value: any) => void) {
        this._onChange = fn;
    }

    registerOnTouched() {
    }

    isLastCharacterDecimalSeparator(value: any) {
        return isNaN(value[value.length - 1]);
    }

    private format(value: string | null) {

        // console.log('at hereeeeeeeeeee', value, this._value)
        if (value === null) {
            this.element.nativeElement.value = '';
            return;
        }

        if (this.isLastCharacterDecimalSeparator(value) && this.elementInput) {
            this.element.nativeElement.value = value;
            return;
        }

        if (this.inputDirective && this.inputDirective.formatValue) {
            const tmp = this.inputDirective.formatValue(value);
            value = tmp === null || tmp === undefined ? value : tmp;
        }


        // console.log('at hereeeeeeeeeee', value, this._value)


        this.element.nativeElement.value = value ? value : '';

    }

    unformatValue(value: any) {
        // console.log('at hereeeeeeeeeee1111', value, this._value)
        if (this.inputDirective && this.inputDirective.unformatValue) {
            value = this.inputDirective.unformatValue(value);
        }
        return value;
    }

    formatValue(value: any) {
        return value;
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
