import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
  ViewEncapsulation
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NgControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {NsValidator} from '@next-solutions/next-solutions-base';
import {QuillEditorComponent, QuillModules, SelectionChange} from 'ngx-quill';
import {CommonUtils} from '../_utils/common/common.utils';

@Component({
  selector: 'ns-quill-editor',
  template: `
    <!-- css labelOutside trong base.theme-->
    <div class="ns-quill-editor"
         [ngClass]="{'labelOutside': !!isLabelOutside,
            'float_label': !!isFloatLabel && !isLabelOutside,
            'text_area': !!this.multiline}"
         fxLayout="row" fxLayout.lt-sm="row wrap">
      <mat-label *ngIf="isLabelOutside" class="label_width"
                 fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
        <div class="label">
          <div>
            {{(label ? label : '') | translate}}<span
            class="required-label-outside">{{!!required ? '*' : ''}}</span>
          </div>
        </div>
      </mat-label>
      <div class="editor" fxLayout="column" fxFlex="100%">
        <quill-editor [(ngModel)]="textValue"
                      [modules]="quillModule"
                      [disabled]="disabled"
                      [readOnly]="readonly"
                      [maxLength]="maxLength"
                      [minLength]="minLength"
                      [placeholder]="placeholder | translate"
                      [format]="format"
                      (onFocus)="onFocus($event)"
                      (onBlur)="onBlur($event)"
                      #quill
                      (onContentChanged)="onChangeContent(quill, $event)"
                      fxFlex="100%" fxFlex.lt-md="100%"
        ></quill-editor>
        <div id="counter"
             *ngIf="!(disabled || readonly) && onFocusStatus && !!maxLength">{{textCounter + '/' + maxLength}}</div>
        <!--        <span *ngIf="onFocusStatus && (!!maxLength || !!maxLengthDisplay)" class="input-suffix"-->
        <!--              matSuffix>{{displayLength()}}</span>-->
        <mat-hint align="center" *ngIf="!NsValidator.invalid(control)">{{hint | translate}}</mat-hint>
        <mat-hint style="color: red" align="center" *ngIf="NsValidator.invalid(control)">
          {{NsValidator.getErrorMessageV1(control, errorMessages).msg | translate: NsValidator.getErrorMessageV1(control, errorMessages).params}}
        </mat-hint>
      </div>
    </div>
  `,
  styles: [
      `
      .ns-quill-editor {
        margin-bottom: 1rem;
      }

      .ns-quill-editor .required-label-outside {
        color: red;
      }

      .ns-quill-editor .ql-container.ql-snow {
        height: 100px;
        overflow-y: auto;
      }

      .ns-quill-editor #counter {
        border: 1px solid #ccc;
        border-width: 0px 1px 1px 1px;
        color: #aaa;
        padding: 5px 15px;
        text-align: right;
      }

      .ns-quill-editor quill-editor {
        margin-bottom: 0 !important;
        word-break: break-word;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    // {
    //     provide: NG_VALUE_ACCESSOR,
    //     useExisting: forwardRef(() => NsInput),
    //     multi: true,
    // },

  ],
})
export class NsQuillEditorComponent implements ControlValueAccessor, OnInit {
  @Input() label = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() text = '';
  textCounter = 0;
  // nếu cho vào base thì define rõ ràng, default check valid only text
  @Input() quillModule: QuillModules = CommonUtils.createQuillModuleIgnoreImage();
  @Input() onlyCheckTextValidation = true;

  @Input() format?: 'object' | 'html' | 'text' | 'json' = 'html';
  @Input() pattern: any = null;
  @Input() readonly = false;
  @Input() errorMessages = new Map<string, (e?: any) => string>();
  @Output() onChange = new EventEmitter<string>();
  @Input() multiline = false;
  @Input() isLabelOutside = false;
  @Input() isFloatLabel = true;
  @Input() minLength: number | undefined;
  @Input() maxLength: number | undefined;
  @Input() maxSize: number | undefined; // don vi byte
  @Input() minSize: number | undefined; // don vi byte
  onFocusStatus = false;
  /* hiển thị suffix thay maxlength */
  @Input() maxLengthDisplay: number | undefined;

  // Chỉ bằng false khi trong NsSmartTable thôi nhé @@
  @Input() isFormControl = true;
  @Input() formatFunc: any;
  control: AbstractControl | undefined = undefined;

  get NsValidator() {
    return NsValidator;
  }

  constructor(private injector: Injector,
              @Self() @Optional() ngControl: NgControl) {
    if (ngControl) {
      // Hành động này thay cho provide: NG_VALUE_ACCESSOR và gắn ControlValueAccessor này vào parent FormControl
      ngControl.valueAccessor = this;
    }
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

  customLengthValidator = (control: AbstractControl): ValidationErrors | null => {
    let length = 0;
    if (!this.onlyCheckTextValidation) {
      const description = control?.value ? control?.value : '';
      length = new Blob([description]).size;
    } else {
      length = this.textCounter;
    }

    if (!!this.minLength && length < this.minLength) {
      return {
        minlength: {
          min: this.minLength,
          actual: length
        }
      }
    }
    if (!!this.maxLength && length > this.maxLength) {
      return {
        maxlength: {
          max: this.maxLength,
          actual: length
        }
      }
    }
    return null;
  };

  customSizeValidator = (control: AbstractControl): ValidationErrors | null => {
    let size = 0;
    const description = control?.value ? control?.value : '';
    size = new Blob([description]).size;

    if (!!this.minSize && size < this.minSize) {
      return {
        minsize: {
          min: this.minSize,
          actual: size
        }
      }
    }
    if (!!this.maxSize && size > this.maxSize) {
      return {
        maxsize: {
          max: this.maxSize,
          actual: size
        }
      }
    }
    return null;
  };

  callValidator() {
    const ngControl = this.injector.get(NgControl);
    // Nếu parent FormControl khởi tạo xong và formControl chưa có giá trị lưu
    if (ngControl && !this.control) {
      // Nếu là NsSmartTable thì phải tự new FormControl còn không thì cứ hóng parent FormControl về ^^
      if (this.isFormControl) {
        this.control = ngControl.control ? ngControl.control : undefined;
      } else {
        this.control = new FormControl();
      }
      // Hành động này gắn validator vào this.formControl
      // - Nếu this.formControl là parent FormControl thì sẽ show error lên FormGroup
      // - Nếu this.formControl là new FormControl thì sẽ quét QueryList để check {errors}
      if (this.control) {
        if (this.control.validator) {
          this.control.setValidators([...NsValidator.generateNsInputValidators({
            required: this.required,
            minLength: undefined,
            maxLength: undefined,
            pattern: this.pattern,
          }), this.control.validator, this.customLengthValidator, this.customSizeValidator]);
        } else {
          this.control.setValidators([...NsValidator.generateNsInputValidators({
            required: this.required,
            minLength: undefined,
            maxLength: undefined,
            pattern: this.pattern,
          }), this.customLengthValidator, this.customSizeValidator]);
        }
      }
    }
    if (this.control) {
      // Nếu this.formControl thuộc NsSmartTable thì setValue lại
      if (!this.isFormControl) {
        this.control.setValue(this.text);
      }
      // Nếu là parent FormControl rồi thì kệ
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

  onFocus(event: any) {
    this.onFocusStatus = true;
  }

  onBlur(event: any) {
    if (this.onFocusStatus) {
      this.onFocusStatus = false;
    }
  }

  onChangeContent(quill: QuillEditorComponent | any, text: any) {
    if (!text.html) {
      this.textCounter = 0;
    } else {
      this.textCounter = quill.editorElem.innerText.length;
    }
    this.writeValue(this.text);
  }

}
