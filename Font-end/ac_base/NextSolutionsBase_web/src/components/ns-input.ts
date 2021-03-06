import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { NsValidator } from '../services/ns-validator.service';

@Component({
  selector: 'ns-input',
  template: `
      <!-- css labelOutside trong base.theme-->
      <div class="ns-input"
           [ngClass]="{'labelOutside': !!isLabelOutside,
            'float_label': !!isFloatLabel && !isLabelOutside,
            'text_area': !!this.multiline}"
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
              <mat-label *ngIf="!isLabelOutside && !!isFloatLabel">
                  {{(label ? label : placeholder) | translate}}
              </mat-label>
              <input matInput placeholder="{{placeholder|translate}}" [type]="type" [(ngModel)]="textValue"
                     [pattern]="pattern"
                     minLength="{{minLength ? minLength : 0}}"
                     maxLength="{{maxLength ? maxLength : 524288}}"
                     [required]="required"
                     [disabled]="disabled"
                     readonly="{{readonly}}"
                     [inputDirective]="formatFunc"
                     *ngIf="!multiline"
                     (focus)="onFocus()"
                     (blur)="onBlur()"
                     pattern-directive
                     [regPattern]="patternFilter"
                     autocomplete="off">
              <textarea matInput [(ngModel)]="textValue" placeholder="{{placeholder|translate}}"
                        [pattern]="pattern"
                        minLength="{{minLength ? minLength : 0}}"
                        maxLength="{{maxLength ? maxLength : 524288}}"
                        [required]="required"
                        [disabled]="disabled"
                        readonly="{{readonly}}"
                        (focus)="onFocus()"
                        (blur)="onBlur()"
                        *ngIf="multiline"
                        cdkTextareaAutosize cdkAutosizeMinRows="3"
                        autocomplete="off"></textarea>
              <i *ngIf="!!suffixFontAwesomeClass" class="input-suffix {{suffixFontAwesomeClass}}" matSuffix></i>
              <span *ngIf="onFocusStatus && (!!maxLength || !!maxLengthDisplay)" class="input-suffix"
                    matSuffix>{{displayLength()}}</span>
              <mat-hint align="center" *ngIf="!NsValidator.invalid(control)">{{hint | translate}}</mat-hint>
              <mat-hint style="color: red" align="center" *ngIf="NsValidator.invalid(control)">
                  {{NsValidator.getErrorMessageV1(control, errorMessages).msg | translate: NsValidator.getErrorMessageV1(control, errorMessages).params}}
              </mat-hint>
          </mat-form-field>
      </div>
  `,
  // styleUrls: ['../styles/ns-style/ns-input.scss'],
  providers: [
    // {
    //     provide: NG_VALUE_ACCESSOR,
    //     useExisting: forwardRef(() => NsInput),
    //     multi: true,
    // },

  ],
})
export class NsInput implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() hint: string = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() text = '';
  @Input() type: string = 'text';
  @Input() pattern: any = null;
  @Input() readonly = false;
  @Input() errorMessages = new Map<string, (e?: any) => string>();
  @Output() onChange = new EventEmitter<string>();
  @Input() multiline = false;
  @Input() isLabelOutside = false;
  @Input() isFloatLabel = true;
  @Input() minLength: number | undefined;
  @Input() maxLength: number | undefined;
  onFocusStatus = false;
  /* hi???n th??? suffix thay maxlength */
  @Input() maxLengthDisplay: number | undefined;
  /* percent label outside css */
  @Input() percentOfLabelOutside: number = 25;

  @Input() suffixFontAwesomeClass: string = '';
  @Input() patternFilter: string = '';

  // Ch??? b???ng false khi trong NsSmartTable th??i nh?? @@
  @Input() isFormControl: boolean = true;
  @Input() formatFunc: any;
  control: AbstractControl | undefined = undefined;

  get NsValidator() {
    return NsValidator;
  }

  constructor(private injector: Injector,
              @Self() @Optional() ngControl: NgControl) {
    if (ngControl) {
      // H??nh ?????ng n??y thay cho provide: NG_VALUE_ACCESSOR v?? g???n ControlValueAccessor n??y v??o parent FormControl
      ngControl.valueAccessor = this;
    }
  }

  // V?? kh??ng th??? qu???t ???????c NgControl ??? constructor n??n ph???i qu???t ??? ????y :(
  ngAfterViewInit() {
    //     const ngControl = this.injector.get(NgControl);
    //     if (ngControl) {
    //         this.control = ngControl.control;
    //         this.callValidator();
    //     }
  }

  ngOnInit(): void {
    this.callValidator();
  }

  get textValue() {
    return this.text;
  }

  set textValue(val) {
    this.writeValue(val);
  }

  callValidator() {
    const ngControl = this.injector.get(NgControl);
    // N???u parent FormControl kh???i t???o xong v?? formControl ch??a c?? gi?? tr??? l??u
    if (ngControl && !this.control) {
      // N???u l?? NsSmartTable th?? ph???i t??? new FormControl c??n kh??ng th?? c??? h??ng parent FormControl v??? ^^
      if (this.isFormControl) {
        this.control = ngControl.control ? ngControl.control : undefined;
      } else {
        this.control = new FormControl();
      }
      // H??nh ?????ng n??y g???n validator v??o this.formControl
      // - N???u this.formControl l?? parent FormControl th?? s??? show error l??n FormGroup
      // - N???u this.formControl l?? new FormControl th?? s??? qu??t QueryList ????? check {errors}
      if (this.control) {
        if (this.control.validator) {
          this.control.setValidators([...NsValidator.generateNsInputValidators({
            required: this.required,
            minLength: this.minLength,
            maxLength: this.maxLength,
            pattern: this.pattern,
          }), this.control.validator]);
        } else {
          this.control.setValidators([...NsValidator.generateNsInputValidators({
            required: this.required,
            minLength: this.minLength,
            maxLength: this.maxLength,
            pattern: this.pattern,
          })]);
        }
      }
    }
    if (this.control) {
      // N???u this.formControl thu???c NsSmartTable th?? setValue l???i
      if (!this.isFormControl) {
        this.control.setValue(this.text);
      }
      // N???u l?? parent FormControl r???i th?? k???
      this.control.updateValueAndValidity();
    }
  }

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  /**
   * Write a new value to the element.
   */
  writeValue(obj: any): void {
    this.text = obj;
    this.propagateChange(this.text);
    this.callValidator();
    this.onChange.emit(this.text);
  }

  /**
   * Set the function to be called
   * when the formControl receives a change event.
   */
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  /**
   * Set the function to be called
   * when the formControl receives a touch event.
   */
  registerOnTouched() {
    /*NON-EMPTY FOR COMPILE*/
  }

  displayLength() {
    if (this.maxLength === null || this.maxLength === undefined) {
      return this.maxLengthDisplay ? this.maxLengthDisplay : '';
    }
    return (this.textValue?.length ? this.textValue.length : 0) + '/' + this.getMaxLength();
  }

  getMaxLength() {
    return this.maxLengthDisplay ? this.maxLengthDisplay : this.maxLength;

  }

  onFocus() {
    this.onFocusStatus = true;
  }

  onBlur() {
    if (this.onFocusStatus) {
      this.onFocusStatus = false;
    }
  }
}
