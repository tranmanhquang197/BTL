import { Component, EventEmitter, Injector, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NsDateAdapter } from './format-datepicker';
import { DateRangePickerModel } from '../../models/date.range.picker.model';
import { DateUtilService } from '../../services/date-util.service';
import { NsValidator } from '../../services/ns-validator.service';
import { MatDateRangePicker } from '@angular/material/datepicker';

@Component({
  selector: 'ns-range-date-picker',
  template: `
      <div class="ns-range-date-picker"
           [ngClass]="{'labelOutside': !!isLabelOutside, 'float_label': !!isFloatLabel && !isLabelOutside}"
           fxLayout="row" fxLayout.lt-sm="row wrap">
          <mat-label *ngIf="isLabelOutside" class="label_width"
                     fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
              <div class="label">
                <div>
                  {{(label ? label : '') | translate}}<span class="required-label-outside">{{!!(requiredFromDate || requiredToDate) ? '*' : ''}}</span>
                </div>
              </div>
          </mat-label>
          <mat-form-field appearance="outline" [floatLabel]="!!isFloatLabel ? 'always' : 'auto'"
                          [hideRequiredMarker]="!isFloatLabel"
                          fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
              <mat-label *ngIf="!isLabelOutside && !!isFloatLabel">{{(label ? label : '') | translate}}</mat-label>
              <mat-date-range-input [min]="getMinDate()"
                                    [max]="getMaxDate()"
                                    [rangePicker]="picker"
                                    [disabled]="getDisabled(disabledAll)"
                                    [title]="title">
                  <input matStartDate
                         [(ngModel)]="fromDateValue"
                         readonly="true"
                         [placeholder]="placeholderFromDate|translate">
                  <input matEndDate
                         [(ngModel)]="toDateValue"
                         readOnly="true"
                         [placeholder]="placeholderToDate|translate">
              </mat-date-range-input>

              <mat-datepicker-toggle matPrefix [for]="picker"
                                     [disabled]="getDisabled(disabledAll)">
              </mat-datepicker-toggle>
              <button mat-icon-button matSuffix
                      color="warn" class="btnDatePicker"
                      (click)="clearRange($event)"
                      [disabled]="getDisabled(disabledAll) || (checkRequired(requiredFromDate) && checkRequired(requiredToDate))"
              >
                  <mat-icon>clear</mat-icon>
              </button>

              <mat-date-range-picker #picker (opened)="openPicker(picker)"></mat-date-range-picker>
              <mat-hint style="color: red" *ngIf="NsValiator.invalid(formControl)">
                  {{NsValiator.getErrorMessage(formControl, errorMessages) | translate}}
              </mat-hint>
          </mat-form-field>
      </div>
  `,
  styles: [/* file ns-range-date-picker.scss in ns-style folder*/],
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
/**
 *  Đây chỉ là control trung gian khi chọn ngày, còn xử lý vẫn xử lý 2 control fromDate và toDate (mặc định)
 *  hoặc được truyền control name chỉ định trong input.
 *  Khi khai báo cần khai báo 2 control name con tương ứng nếu không mặc định 2 control con là fromDate và toDate
 */
export class NsRangeDatePickerComponent implements ControlValueAccessor, OnInit {
  @Input() label = 'common.apply.time';
  @Input() placeholderFromDate = '';
  @Input() placeholderToDate = '';
  /**
   * giá trị là true khi muốn disabled tất cả control
   */
  @Input() disabledAll: boolean | (() => boolean) = false;

  /**
   * giá trị là true khi muốn disabled control name fromDate
   */
  @Input() disabledFromDate: boolean | (() => boolean) = false;
  @Input() value = new DateRangePickerModel();
  @Input() requiredFromDate: boolean | (() => boolean) = false;
  @Input() requiredToDate: boolean | (() => boolean) = false;
  @Input() minDate: (() => Date) | Date = new Date(1900, 1, 1);
  @Input() maxDate: (() => Date) | Date = new Date(9999, 12, 31);
  @Output() onChange = new EventEmitter<any>();
  @Output() onOpenPicker = new EventEmitter<any>();

  /** key: requiredFromDate, requiredToDate, min, max */
  @Input() errorMessages = new Map<string, (e?: any) => string>();
  @Input() isLabelOutside = false;
  @Input() isFloatLabel = true;
  /** percent label outside css */
  @Input() percentOfLabelOutside = 25;

  @Input() fromDateControlName = 'fromDate';
  @Input() toDateControlName = 'toDate';

  title: string | null = '';
  // config: NextSolutionsConfig;

  // Chỉ bằng false khi trong NsSmartTable thôi @@
  @Input() isFormControl = true;

  formControl: AbstractControl | undefined;

  defaultFromDate: any; // lưu giá trị khởi tạo ban đầu khi truyền từ bên ngoài vào

  get NsValiator() {
    return NsValidator;
  }

  constructor(private dateServiceUtil: DateUtilService,
              @Self() @Optional() ngControl: NgControl,
              private injector: Injector) {
    // this.config = injector.get(InjectTokenNextSolutionsConfig);
    if (ngControl) {
      // Hành động này thay cho provide: NG_VALUE_ACCESSOR và gắn ControlValueAccessor này vào parent FormControl
      ngControl.valueAccessor = this;
    }
  }

  get fromDateValue() {
    if (this.value.fromDate instanceof Date) {
      return this.value.fromDate;
    }
    if (this.isString(this.value.fromDate) && this.value.fromDate.indexOf('Z') >= 0) {
      return this.value.fromDate.replace(' ', 'T');
    }
    return null;
  }

  set fromDateValue(val) {
    this.value.fromDate = val;
  }

  get toDateValue() {
    if (this.value.toDate instanceof Date) {
      return this.value.toDate;
    }
    if (this.isString(this.value.toDate) && this.value.toDate.indexOf('Z') >= 0) {
      return this.value.toDate.replace(' ', 'T').replace('Z', '');
    }
    return null;
  }

  set toDateValue(val) {
    this.value.toDate = val;
    this.writeValue(this.value);
  }

  ngOnInit(): void {
    this.callValidator();
  }

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  registerOnChange(fn: any): void {
    this.propagateChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.propagateChange(fn);
  }

  writeValue(obj: DateRangePickerModel): void {
    if (!obj) {
      obj = new DateRangePickerModel();
    }
    if (!this.defaultFromDate && this.value.fromDate instanceof Date) {
      this.defaultFromDate = this.prepareWriteValueData(this.value.fromDate);
    }
    // this.value = obj;
    this.value.fromDate = this.prepareWriteValueData(obj.fromDate);
    this.value.toDate = this.prepareWriteValueData(obj.toDate);

    this.createTitle();

    this.propagateChange(this.value);
    this.callValidator();
    this.onChange.emit(this.value);
    if (this.defaultFromDate && this.getDisabled(this.disabledFromDate)) {
      this.value.fromDate = new Date(this.defaultFromDate.replace('Z', ''));
    }
  }

  getDisabled(disabled: boolean | (() => boolean)){
      return typeof disabled === 'function' ? disabled() : !!disabled;
  }

  createTitle() {
    const titleFromDate = this.dateServiceUtil.convertDateToDisplayGMT0(this.value.fromDate);
    const titleToDate = this.dateServiceUtil.convertDateToDisplayGMT0(this.value.toDate);
    this.title = (titleFromDate ? titleFromDate : '') + ' - '
      + (titleToDate ? titleToDate : '');
  }

  callValidator() {
    const ngControl = this.injector.get(NgControl);
    // console.log('NsCounterInput - callValidator - ngControl: ', ngControl);
    // Nếu parent FormControl khởi tạo xong và formControl chưa có giá trị lưu
    if (ngControl && !this.formControl) {
      // Nếu là NsSmartTable thì phải tự new FormControl còn không thì cứ hóng parent FormControl về ^^
      if (this.isFormControl) {
        this.formControl = ngControl.control ? ngControl.control : undefined;
        if (!this.formControl?.value) {
          this.formControl?.setValue(this.value);
        }
      } else {
        this.formControl = new FormControl();
      }
      // Hành động này gắn validator vào this.formControl
      // - Nếu this.formControl là parent FormControl thì sẽ show error lên FormGroup
      // - Nếu this.formControl là new FormControl thì sẽ quét QueryList để check {errors}
      if (this.formControl) {
        // this.formControl.setValidators(NsValidator.generateNsDateRangePickerValidators(
        //   {
        //     requiredFromDate: this.requiredFromDate,
        //     requiredToDate: this.requiredToDate,
        //   }
        // ));
      }
    }
    if (this.formControl) {
      // Nếu this.formControl thuộc NsSmartTable thì setValue lại
      if (!this.isFormControl) {
        this.formControl.setValue(this.value);
      }
      // Nếu là parent FormControl rồi thì kệ
      if (this.formControl?.parent && this.formControl instanceof FormControl) {
        this.formControl.parent.controls[this.fromDateControlName]?.setValue(this.value.fromDate);
        this.formControl.parent.controls[this.toDateControlName]?.setValue(this.value.toDate);
      }

      this.formControl.updateValueAndValidity();

      const errorsObj = {};

      const errors = this.formControl.errors;
      if (errors) {
        Object.keys(errors).forEach(key => {
          errorsObj[key] = errors[key];
        });
      }

      if (this.checkRequired(this.requiredFromDate)) {
        if (!this.value.fromDate) {
          errorsObj['requiredFromDate'] = true;
        }
      }

      if (this.checkRequired(this.requiredToDate)) {
        if (!this.value.toDate) {
          errorsObj['requiredToDate'] = true;
        }
      }

      if (!(this.getDisabled(this.disabledFromDate) || this.getDisabled(this.disabledAll))) {
        const minValidation = NsValidator.customMinDateValidatorControl(this.value.fromDate, this.getMinDate());
        if (minValidation) {
          Object.keys(minValidation).forEach(key => {
            errorsObj[key] = minValidation[key];
          });
          this.formControl.markAsDirty();
        }
      }

      const maxValidation = NsValidator.customMaxDateValidatorControl(this.value.toDate, this.getMaxDate());
      if (maxValidation) {
        Object.keys(maxValidation).forEach(key => {
          errorsObj[key] = maxValidation[key];
        });
        this.formControl.markAsDirty();
      }

      if (Object.keys(errorsObj).length > 0) {
        this.formControl.setErrors(errorsObj);
      } else {
        this.formControl.setErrors(null);
      }
      this.formControl.markAllAsTouched();
    }
  }

  prepareWriteValueData(val: any) {
    let out: string | null = '';
    if (val) {
      if (this.isString(val) && val.toString().indexOf('Z') >= 0) {
        out = this.dateServiceUtil.convertDateToStringGMT0(val);
      } else {
        out = this.dateServiceUtil.convertDateToStringCurrentGMT(val);
      }
    }
    return out;
  }

  isString(inputValue: any): boolean {
    return typeof inputValue === 'string' || inputValue instanceof String;
  }

  getMinDate() {
    if (this.minDate) {
      return this.minDate instanceof Date ? this.minDate : this.minDate();
    }
    return new Date(1900, 1, 1);
  }

  getMaxDate() {
    if (this.getDisabled(this.disabledAll)) {
      return new Date(9999, 12, 31);
    }
    if (this.maxDate) {
      return this.maxDate instanceof Date ? this.maxDate : this.maxDate();
    }
    return new Date(9999, 12, 31);
  }

  checkRequired(isRequired: boolean | (() => boolean)) {
    return isRequired ? typeof (isRequired) === 'boolean' ? isRequired : isRequired() : false;
  }

  clearRange(event: Event) {
    event.stopPropagation();
    if (this.getDisabled(this.disabledFromDate)) {
      this.value.toDate = '';
    } else {
      this.value = new DateRangePickerModel();
    }
    this.writeValue(this.value);
  }

  openPicker(picker: MatDateRangePicker<any>) {
    if (this.onOpenPicker){
      this.onOpenPicker.emit(picker);
    }
  }
}
