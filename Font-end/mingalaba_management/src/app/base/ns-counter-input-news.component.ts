import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import {AlignEnum, NsValidator } from '@next-solutions/next-solutions-base';

@Component({
  selector: 'ns-counter-input-news',
  template: `
    <!-- css labelOutside trong base.theme-->
    <div class="ns-counter-input"
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
        <div class="input-area">
          <input matInput type="number" [(ngModel)]="counterValue" #nsCounterInput="ngModel"
                 style="text-align: {{alignNumber}}"
                 [disabled]="disabled" [required]="required"
                 [placeholder]="placeholder|translate"
                 autocomplete="off"
                 pattern="{{isDecimal ? '^[^-]?[0-9]+[.]?[0-9]*$' : '^[0-9]*$'}}" min="{{min}}" max="{{max}}"/>
          <span *ngIf="!!suffixText" class="input-suffix"
                matSuffix>{{suffixText}}</span>
        </div>
        <mat-hint *ngIf="!NsValidator.invalid(formControl)">
          {{hint | translate}}
        </mat-hint>
        <mat-hint style="color: red" *ngIf="NsValidator.invalid(formControl)">
          Value between {{ min + '-' + max }} 
        </mat-hint>
      </mat-form-field>
    </div>
  `,
  // styleUrls: ['../styles/ns-style/ns-counter-input.scss'],
  // providers: [
  //     {
  //         provide: NG_VALUE_ACCESSOR,
  //         useExisting: forwardRef(() => NsCounterInput),
  //         multi: true,
  //     },
  //     {
  //         provide: NG_VALIDATORS,
  //         useExisting: forwardRef(() => NsCounterInput),
  //         multi: true
  //     }
  // ],
})
export class NsCounterInputNewsComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() suffixText = '';
  @Input() hint = '';
  @Input() value = 0;
  @Input() disabled = false;
  @Input() required = false;
  @Input() errorMessages = new Map<string, (e?: any) => string>();
  @Input() min: (() => number) | number | null = null;
  @Input() max: (() => number) | number | null = null;
  @Input() error: any;
  @Input() isDecimal = false;
  @Input() isLabelOutside = false;
  @Input() isFloatLabel = true;
  /* percent label outside css */
  @Input() percentOfLabelOutside = 25;
  @Input() alignNumber: AlignEnum = AlignEnum.RIGHT;

  // Ch??? b???ng false khi trong NsSmartTable th??i nh?? @@
  @Input() isFormControl = true;

  @Output() onChange = new EventEmitter<number>();

  // C??i n??y l?? ????? g???n khi n?? l?? FormControl trong 1 FormGroup
  formControl: AbstractControl | undefined;
  get NsValidator() {
    return NsValidator;
  }

  constructor(private injector: Injector, @Self() @Optional() ngControl: NgControl) {
    if (ngControl) {
      // console.log('nsCounterInput - ngControl: ', ngControl);
      // ngControl l?? parent FormControl
      // H??nh ?????ng n??y thay cho provide: NG_VALUE_ACCESSOR v?? g???n ControlValueAccessor n??y v??o parent FormControl
      ngControl.valueAccessor = this;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('value' in changes){
      this.value = changes.value.currentValue;
      this.writeValue(this.value);
    }
  }

  ngOnInit() {
    // console.log('NsCounterInput - ngOnInit');
    this.callValidator();
  }

  get counterValue() {
    return this.value;
  }

  set counterValue(val: number) {
    this.writeValue(val);
  }

  getMinNumber() {
    return typeof (this.min) === 'function' ? this.min() : this.min;
  }

  getMaxNumber() {
    return typeof (this.max) === 'function' ? this.max() : this.max;
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
        this.formControl.setValidators(NsValidator.generateNsCounterInputValidators({
          required: this.required,
          min: null/*this.min*/,
          max: null/*this.max*/,
          isDecimal: this.isDecimal,
        }));
      }
    }
    if (this.formControl) {
      // N???u this.formControl thu???c NsSmartTable th?? setValue l???i
      if (!this.isFormControl) {
        this.formControl.setValue(this.value);
      }
      // N???u l?? parent FormControl r???i th?? k???
      this.formControl.updateValueAndValidity();

      // if (!this.formControl.errors) {
      //   const minErr = NsValidator.customMinValueNsCounterInput(this.value, this.getMinNumber());
      //   if (minErr) {
      //     this.formControl.setErrors(minErr);
      //   }
      //   const maxErr = NsValidator.customMaxValueNsCounterInput(this.value, this.getMaxNumber());
      //   if (maxErr) {
      //     this.formControl.setErrors(maxErr);
      //   }
      //
      //   // this.formControl.markAllAsTouched();
      //   // if (!this.isFormControl) {
      //   //   this.formControl.markAsDirty();
      //   // }
      // }
    }
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
      this.propagateChange(this.value);
      // console.log('NsCounterInput - writeValue: ', this.value);
      this.callValidator();
      this.onChange.emit(this.value);
    }
  }

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
    /*NON-EMPTY FOR COMPILE*/
  }

}
