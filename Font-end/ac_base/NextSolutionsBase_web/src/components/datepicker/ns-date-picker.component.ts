import { Component, EventEmitter, Injector, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NsDateAdapter } from './format-datepicker';
import { DateUtilService } from '../../services/date-util.service';
import { InjectTokenNextSolutionsConfig, NextSolutionsConfig } from '../../modules/next.solutions.config';
import { NsValidator } from '../../services/ns-validator.service';

@Component({
  selector: 'ns-date-picker',
  template: `
      <!-- css labelOutside trong base.theme-->
      <div class="ns-date-picker"
           [ngClass]="{'labelOutside': !!isLabelOutside, 'float_label': !!isFloatLabel && !isLabelOutside}"
           fxLayout="row" fxLayout.lt-sm="row wrap">
          <mat-label *ngIf="isLabelOutside" class="label_width"
                     fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
              <div class="label">
                <div>
                  {{(label ? label : placeholder) | translate}}<span class="required-label-outside">{{!!required ? '*' : ''}}</span>
                </div>
              </div>
          </mat-label>
          <mat-form-field appearance="outline" [floatLabel]="!!isFloatLabel ? 'always' : 'auto'"
                          [hideRequiredMarker]="!isFloatLabel"
                          fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
              <mat-label *ngIf="!isLabelOutside && !!isFloatLabel">{{(label ? label : placeholder) | translate}}</mat-label>
              <input matInput [matDatepicker]="xDatepicker"
                     [placeholder]="placeholder|translate"
                     [(ngModel)]="datepickerValue"
                     [readonly]="true"
                     [required]="checkRequired(required)"
                     [title]="title ? title : ''"
                     [min]="getMinDate()" [max]="getMaxDate()">
              <mat-datepicker-toggle matPrefix [for]="xDatepicker" [disabled]="disabled"></mat-datepicker-toggle>
              <mat-datepicker #xDatepicker></mat-datepicker>
              <button mat-icon-button color="warn" class="btnDatePicker" matSuffix (click)="onClear()"
                      [disabled]="disabled || checkRequired(required)">
                  <mat-icon>clear</mat-icon>
              </button>

              <mat-hint style="color: red" *ngIf="NsValidator.invalid(formControl)">
                  {{NsValidator.getErrorMessage(formControl, errorMessages) | translate}}
              </mat-hint>

          </mat-form-field>
      </div>
  `,
  // styleUrls: ['../../styles/ns-style/ns-date-picker.scss'],
  providers: [
    { provide: DateAdapter, useClass: NsDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
        },
        display: {
          dateInput: 'input',
          monthYearLabel: { year: 'numeric', month: 'numeric' },
          dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
          monthYearA11yLabel: { year: 'numeric', month: 'long' },
        },
      },
    },
  ],
})
export class NsDatePicker implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() value: any;
  @Input() disabled: boolean = false;
  @Input() required: boolean | (() => boolean) = false;
  @Input() minDate: (() => Date) | Date = new Date(1900, 1, 1);
  @Input() maxDate: (() => Date) | Date = new Date(9999, 12, 31);
  @Output() onChange = new EventEmitter<string>();
  @Input() errorMessages = new Map<string, (e?: any) => string>();
  @Input() isLabelOutside = false;
  @Input() isFloatLabel = true;
  /* percent label outside css */
  @Input() percentOfLabelOutside: number = 25;

  title: string | null = null;
  config: NextSolutionsConfig;

  // Ch??? b???ng false khi trong NsSmartTable th??i @@
  @Input() isFormControl: boolean = true;

  formControl: AbstractControl | undefined;


  get NsValidator() {
    return NsValidator;
  }

  constructor(private dateServiceUtil: DateUtilService,
              @Self() @Optional() ngControl: NgControl,
              private injector: Injector) {
    this.config = injector.get(InjectTokenNextSolutionsConfig);
    if (ngControl) {
      // H??nh ?????ng n??y thay cho provide: NG_VALUE_ACCESSOR v?? g???n ControlValueAccessor n??y v??o parent FormControl
      ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.callValidator();
  }

  callValidator() {
    const ngControl = this.injector.get(NgControl);
    // console.log('NsCounterInput - callValidator - ngControl: ', ngControl);
    // N???u parent FormControl kh???i t???o xong v?? formControl ch??a c?? gi?? tr??? l??u
    if (ngControl && !this.formControl) {
      // N???u l?? NsSmartTable th?? ph???i t??? new FormControl c??n kh??ng th?? c??? h??ng parent FormControl v??? ^^
      if (this.isFormControl) {
        this.formControl = ngControl.control ? ngControl.control : undefined;
      } else {
        this.formControl = new FormControl();
      }
      // console.log('NsCounterInput - callValidator - this.formControl: ', this.formControl);
      // H??nh ?????ng n??y g???n validator v??o this.formControl
      // - N???u this.formControl l?? parent FormControl th?? s??? show error l??n FormGroup
      // - N???u this.formControl l?? new FormControl th?? s??? qu??t QueryList ????? check {errors}
      if (this.formControl) {
        this.formControl.setValidators(NsValidator.generateNsDatePickerValidators(
          {
            required: this.required,
            min: this.getMinDate(),
            max: this.getMaxDate(),
          },
        ));
      }
    }
    if (this.formControl) {
      // N???u this.formControl thu???c NsSmartTable th?? setValue l???i
      if (!this.isFormControl) {
        this.formControl.setValue(this.value);
      }
      // N???u l?? parent FormControl r???i th?? k???
      this.formControl.updateValueAndValidity();

      const errorsObj = {};

      const errors = this.formControl.errors;
      if (errors) {
        Object.keys(errors).forEach(key => {
          errorsObj[key] = errors[key];
        });
      }

      const minValidation = NsValidator.customMinDateValidatorControl(this.value, this.getMinDate());
      if (minValidation) {
        Object.keys(minValidation).forEach(key => {
          errorsObj[key] = minValidation[key];
        });
      }

      const maxValidation = NsValidator.customMaxDateValidatorControl(this.value, this.getMaxDate());
      if (maxValidation) {
        Object.keys(maxValidation).forEach(key => {
          errorsObj[key] = maxValidation[key];
        });
      }

      if (Object.keys(errorsObj).length > 0) {
        this.formControl.setErrors(errorsObj);
      } else {
        this.formControl.setErrors(null);
      }
      this.formControl.markAllAsTouched();
    }
  }

  checkRequired(isRequired: boolean | (() => boolean)) {
    return isRequired ? typeof (isRequired) === 'boolean' ? isRequired : isRequired() : false;
  }

  get datepickerValue() {
    if (this.value instanceof Date) {
      return this.value;
    }
    if (this.isString(this.value) && this.value.indexOf('Z') >= 0) {
      return this.value.replace(' ', 'T');
    }
    return null;
  }

  set datepickerValue(val) {
    this.writeValue(val);
  }

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    /*NON-EMPTY FOR COMPILE*/
  }

  writeValue(obj: Date | string | null): void {
    let out: string | null = '';
    this.value = obj;
    if (obj) {
      // N???u l?? d???ng server tr??? v??? l?? string v?? c?? Z th?? thu???c GMT+0 n??n s??? ??p v??? zone -0
      if (this.isString(this.value) && this.value.indexOf('Z') >= 0) {
        out = this.dateServiceUtil.convertDateToStringGMT0(obj);
      } else {
        out = this.dateServiceUtil.convertDateToStringCurrentGMT(this.value);
      }
    }
    if (out) {
      this.title = this.dateServiceUtil.convertDateToDisplayGMT0(out);
    }
    this.propagateChange(out);
    this.callValidator();
    this.onChange.emit(out ? out : '');
  }

  onClear() {
    this.writeValue(null);
  }

  getMinDate() {
    if (this.minDate) {
      return this.minDate instanceof Date ? this.minDate : this.minDate();
    }
    return new Date(1900, 1, 1);
  }

  getMaxDate() {
    if (this.maxDate) {
      return this.maxDate instanceof Date ? this.maxDate : this.maxDate();
    }
    return new Date(9999, 12, 31);
  }

  isString(inputValue: any): boolean {
    return typeof inputValue === 'string' || inputValue instanceof String;
  }

  validate(c: FormControl) {
    if (!c) {
      return null;
    }
    this.formControl = c;
    // if (this.formControl.invalid) {
    //     return this.formControl.errors;
    // }
    if (c.value) {
      let date = new Date((c.value as string).replace(' ', 'T'));
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (this.getMinDate() &&
        date < new Date(this.getMinDate().getFullYear(), this.getMinDate().getMonth(), this.getMinDate().getDate())) {
        return { min: { valid: false, minValue: this.minDate, actual: date } };
      }
      if (this.getMaxDate() &&
        date > new Date(this.getMaxDate().getFullYear(), this.getMaxDate().getMonth(), this.getMaxDate().getDate())) {
        return { max: { valid: false, maxValue: this.maxDate, actual: date } };
      }
    }
    return null;
  }

}
