import {
  Component,
  EventEmitter,
  Injector,
  Input, OnChanges,
  OnInit,
  Optional,
  Output,
  Self, SimpleChange, SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {NsValidator, SelectModel} from '@next-solutions/next-solutions-base';
import {AbstractControl, ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-ns-dialog-choose',
  template: `
    <!-- css labelOutside trong base.theme-->
    <div class="ns-dialog-choose"
         [ngClass]="{'labelOutside': !!isLabelOutside}"
         fxLayout="row"
         fxLayout.lt-md="column"
         (click)="onOpenDialog(matSelect)">
      <mat-label *ngIf="isLabelOutside" fxFlex="1 1 {{percentOfLabelOutside}}%">
        {{(label ? label : '') | translate}}
        <span class="required-label-outside">{{!!required ? '*' : ''}}</span>
      </mat-label>
      <mat-form-field appearance="outline" fxFlex="1 1">
        <mat-label *ngIf="!isLabelOutside">{{(label ? label : '') | translate}}</mat-label>
        <mat-select #matSelect
                    panelClass="panel-class"
                    [disabled]="disabled"
                    [placeholder]="placeholder | translate"
                    [(ngModel)]="selectedValue"
                    [required]="required"
                    (selectionChange)="onSelectionChange($event)">
          <mat-option class="selected-options" *ngFor="let option of options"
                      [value]="option.value">{{option.displayValue}}</mat-option>
        </mat-select>
        <mat-icon matPrefix>open_in_new</mat-icon>
        <button matSuffix mat-icon-button [disabled]="disabled" (click)="onClear($event)">
          <mat-icon>clear</mat-icon>
        </button>
        <mat-hint style="color: red" *ngIf="invalid()">
          {{getErrorMessage() | translate}}
        </mat-hint>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .panel-class {
      /*visibility: hidden;*/
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class NsDialogChooseComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() placeholder = '';
  @Input() label = '';
  @Input() value: any[] | any = [];
  @Input() options: SelectModel[] = [];
  @Input() disabled = false;
  @Input() errorMessages = new Map<string, () => string>();
  @Input() required = false;
  @Input() isLabelOutside = false;
  /* percent label outside css */
  @Input() percentOfLabelOutside = 25;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Output() onClearEvent: EventEmitter<any> = new EventEmitter();
  // Chỉ bằng false khi trong NsSmartTable thôi nhé @@
  @Input() isFormControl = true;

  // Cái này là để gắn khi nó là FormControl trong 1 FormGroup
  formControl: AbstractControl | undefined;

  constructor(private translateService: TranslateService, private injector: Injector,
              @Self() @Optional() ngControl: NgControl,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    this.callValidator();
  }

  ngOnChanges(changes: SimpleChanges) {
    // if ('options' in changes) {
    //   this.options = changes.options.currentValue;
    // }

    if (this.value) {
      this.writeValue(this.value);
    }
    // else if (this.formControl.value) {
    //     this.writeValue(this.formControl.value);
    // }
  }

  callValidator() {
    const ngControl = this.injector.get(NgControl);
    if (ngControl && !this.formControl) {
      // Nếu là NsSmartTable thì phải tự new FormControl còn không thì cứ hóng parent FormControl về ^^
      if (this.isFormControl) {
        this.formControl = ngControl.control ? ngControl.control : undefined;
      } else {
        this.formControl = new FormControl();
      }
      if (this.formControl) {
        this.formControl.setValidators(NsValidator.generateNsMultiSelectValidators({
          required: this.required,
        }));
      }
    }
    if (this.formControl) {
      // Nếu this.formControl thuộc NsSmartTable thì setValue lại
      if (!this.isFormControl) {
        this.formControl.setValue(this.value);
      }
      this.formControl.updateValueAndValidity();
      // const ngControl = this.injector.get(NgControl);
      // if (ngControl && ngControl.control && this.formControl.errors) {
      //   ngControl.control.setErrors(this.formControl.errors);
      // }
    }
  }

  get selectedValue() {
    return this.value;
  }

  set selectedValue(val: any[] | any) {
    this.writeValue(val);
  }

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  writeValue(obj: any[] | any): void {
    if (obj !== null && obj !== undefined && this.value !== obj) {
      this.value = obj;
      this.propagateChange(this.value);
      this.callValidator();
      this.selectionChange.emit(this.value);
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
    /*NON-EMPTY FOR COMPILE*/
  }

  onSelectionChange(val: MatSelectChange) {
    this.writeValue(val.value);
  }


  invalid(): boolean {
    return this.formControl ? this.formControl.invalid : false;
  }

  getErrorMessage(): string {
    if (!this.formControl) {
      return '';
    }
    const {errors} = this.formControl;
    const messages: string[] = errors ? Object.keys(errors).map(key => {
      const fn = this.errorMessages.has(key) ? this.errorMessages.get(key) : null;
      return fn ? fn() : 'common.error.';
    }) : [];
    return messages && messages.length > 0 ? messages[0] : '';
  }

  onOpenDialog(matSelect: MatSelect) {
    matSelect.close();
    if (!this.disabled) {
      this.onClick.emit();
    }
  }

  onClear(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      if (this.formControl) {
        this.formControl.setValue('');
        this.options = [];
        this.onClearEvent.emit();
      }
    }
  }
}
