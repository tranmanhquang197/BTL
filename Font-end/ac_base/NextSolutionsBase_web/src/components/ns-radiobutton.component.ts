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
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NgControl, Validators} from '@angular/forms';
import { SelectModel } from '../models/select.model';
import {NsValidator} from "../services/ns-validator.service";

@Component({
  selector: 'ns-radiobutton',
  template: `
    <div class="ns-radiobutton {{!!placeholder ? 'labelOutside' : ''}}"
         fxLayout="row wrap" fxLayout.lt-sm="row">
      <mat-label id="example-radio-group-label" *ngIf="!!placeholder" class="label_width"
             fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
        <div class="label">
          <div>
            {{placeholder | translate}}<span class="required-label-outside">{{!!required ? '*' : ''}}</span>
          </div>
        </div>
      </mat-label>
      <mat-radio-group
          aria-labelledby="example-radio-group-label"
          class="example-radio-group" [disabled]="disabled"
          [(ngModel)]="selectedValue"
          fxLayout="{{direction === 'horizontal' ? 'row' : 'column'}}" fxFlex="auto" fxFlex.lt-md="100%">
        <mat-radio-button class="example-radio-button"
                          *ngFor="let option of options"
                          [value]="option.value"
                          [disabled]="option.disabled">
          {{option.displayValue | translate}}
        </mat-radio-button>
      </mat-radio-group>
      <mat-hint align="center" *ngIf="NsValidator.invalid(control)">
        {{NsValidator.getErrorMessage(control, errorMessages) | translate}}
      </mat-hint>
    </div>
  `,
  // encapsulation: ViewEncapsulation.None,
  // styleUrls: ['../styles/ns-style/ns-radio-button.scss'],
})
export class NsRadiobuttonComponent implements ControlValueAccessor, OnChanges, OnInit {

  @Input() placeholder: string = '';
  @Input() value: any;
  @Input() options: SelectModel[] = [];
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() direction: 'vertical' | 'horizontal' = 'horizontal';
  @Input() errorMessages = new Map<string, (e?: any) => string>();

  @Output() onChange = new EventEmitter();

  // Ch??? b???ng false khi trong NsSmartTable th??i nh?? @@
  @Input() isFormControl: boolean = true;

  control: AbstractControl | undefined = undefined;

  get selectedValue() {
    return this.value;
  }

  set selectedValue(val: number) {
    this.writeValue(val);
  }

  get NsValidator(){
    return NsValidator;
  }

  constructor(private injector: Injector, @Self() @Optional() ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  ngOnChanges(): void {
    this.writeValue(this.value);
  }

  ngOnInit() {
    this.callValidator();
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
      this.propagateChange(this.value);
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
          if (this.required){
            this.control.setValidators([Validators.required,this.control.validator]);
          }else {
            this.control.setValidators([this.control.validator]);
          }
        } else {
          if (this.required){
            this.control.setValidators([Validators.required]);
          }

        }
      }
    }
    if (this.control) {
      // N???u this.formControl thu???c NsSmartTable th?? setValue l???i
      if (!this.isFormControl) {
        this.control.setValue(this.selectedValue);
      }
      // N???u l?? parent FormControl r???i th?? k???
      this.control.updateValueAndValidity();
    }
  }
}
