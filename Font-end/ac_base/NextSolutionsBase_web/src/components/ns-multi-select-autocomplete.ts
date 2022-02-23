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
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { SelectModel } from '../models/select.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { NsValidator } from '../services/ns-validator.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatOptionSelectionChange } from '@angular/material/core/option/option';

@Component({
  selector: 'ns-multi-select-autocomplete',
  template: `
      <!-- css labelOutside trong base.theme-->
      <div class="ns-multi-select-autocomplete"
           [ngClass]="{'labelOutside': !!isLabelOutside, 'float_label': !!isFloatLabel && !isLabelOutside}"
           fxLayout="row" fxLayout.lt-sm="row wrap">
          <mat-label *ngIf="isLabelOutside" class="label_width"
                     fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
              <div class="label">
                  <div>
                      {{(label ? label : placeholder) | translate}}<span
                          class="required-label-outside">{{!!getRequired() ? '*' : ''}}</span>
                  </div>
              </div>
          </mat-label>
          <mat-form-field appearance="outline" [floatLabel]="!!isFloatLabel ? 'always' : 'auto'"
                          [hideRequiredMarker]="!isFloatLabel"
                          fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
              <mat-label *ngIf="!isLabelOutside && !!isFloatLabel">{{(label ? label : placeholder) | translate}}</mat-label>
              <mat-select [disabled]="disabled"
                          [placeholder]="placeholder | translate"
                          [multiple]="multiple"
                          [(ngModel)]="selectedValue"
                          [required]="getRequired()"
                          (selectionChange)="matSelectionChange($event)"
                          (openedChange)="openChange($event)">
                  <div class="box-search">
                      <mat-checkbox *ngIf="multiple" color="primary" class="box-select-all"
                                    [(ngModel)]="selectAllChecked"
                                    (change)="toggleSelectAll($event)"></mat-checkbox>
                      <input #searchInput type="text" [ngClass]="{'pl-1': !multiple}"
                             (keydown.space)="$event.stopPropagation()"
                             (input)="filterItem(searchInput.value)"
                             placeholder="{{'btnSearch' | translate}}...">
                      <div class="box-search-icon" (click)="filterItem(''); searchInput.value = ''">
                          <button mat-icon-button class="search-button">
                              <mat-icon class="mat-24" aria-label="Search icon">clear</mat-icon>
                          </button>
                      </div>
                  </div>
                  <mat-select-trigger title="{{displayString|translate}}">
                      {{displayString | translate}}
                  </mat-select-trigger>
                  <cdk-virtual-scroll-viewport [itemSize]="getItemSize()"
                                               [style.height.px]="getViewPortHeight()">
                      <mat-option *cdkVirtualFor="let option of filteredOptions; let i = index"
                                  [attr.data-optionIndex]="i"
                                  [disabled]="option.disabled" [value]="option.value"
                                  [ngClass]="{'tree-mat-option': isTree}"
                                  title="{{option.displayValue|translate}}"
                                  (onSelectionChange)="onSelectionChange($event)">
                          <div *ngIf="!isTree">{{option.displayValue | translate}}</div>
                          <div *ngIf="!!isTree" class="tree-multiline-mat-option">
                              <div mat-line>{{ onDisplayTreeData(option.displayValue, true) }}</div>
                              <p mat-line>{{ onDisplayTreeData(option.displayValue, false) }}</p>
                          </div>
                      </mat-option>
                  </cdk-virtual-scroll-viewport>
                  <ng-container *ngIf="multiple">
                      <ng-container *ngFor="let option of selectedValue; let i = index">
                          <mat-option class="selected-options" [value]="option" *ngIf="i===0">
                              {{option}}
                          </mat-option>
                      </ng-container>
                  </ng-container>
                  <ng-container *ngIf="!multiple">
                      <mat-option class="selected-options" *ngIf="!!selectedValue"
                                  [value]="selectedValue">{{selectedValue}}</mat-option>
                  </ng-container>
              </mat-select>
              <mat-icon matSuffix>expand_more</mat-icon>
              <mat-hint style="color: red" *ngIf="NsValidator.invalid(formControl)">
                  {{NsValidator.getErrorMessage(formControl, errorMessages) | translate}}
              </mat-hint>
          </mat-form-field>
      </div>
  `,
  // styleUrls: ['../styles/ns-style/ns-multi-select-autocomplete.scss'],
  // encapsulation: ViewEncapsulation.None,
  // providers: [
  //     {
  //         provide: NG_VALUE_ACCESSOR,
  //         useExisting: forwardRef(() => NsMultiSelectAutocomplete),
  //         multi: true,
  //     },
  // ],
})
export class NsMultiSelectAutocomplete implements ControlValueAccessor, OnInit, OnChanges {

  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() value: any[] | any = [];
  @Input() options: SelectModel[] = [];
  @Input() disabled = false;
  @Input() errorMessages = new Map<string, (e?: any) => string>();
  @Input() multiple = true;
  @Input() required: boolean | (() => boolean) = false;
  @Input() isTree = false;
  @Input() treeSymbol: string = ' >> ';
  @Input() sizeOfItemsInListByPixels: number = 39;
  @Input() isLabelOutside = false;
  @Input() isFloatLabel = true;
  /* percent label outside css */
  @Input() percentOfLabelOutside: number = 25;

  @Output() selectionChange = new EventEmitter();
  @Output() selectedOptionDataChange = new EventEmitter<SelectModel[]>();
  valueOptionRef: SelectModel[] = [];

  // Chỉ bằng false khi trong NsSmartTable thôi nhé @@
  @Input() isFormControl: boolean = true;

  // Cái này là để gắn khi nó là FormControl trong 1 FormGroup
  formControl: AbstractControl | undefined;
  filteredOptions: SelectModel[] = [];
  selectAllChecked = false;
  _displayString = '';
  get displayString() {
    return this._displayString;
  }

  labelCount: number = 1;

  @ViewChild(CdkVirtualScrollViewport, { static: false }) cdkVirtualScrollViewPort: CdkVirtualScrollViewport | undefined;

  get NsValidator() {
    return NsValidator;
  }

  constructor(private translateService: TranslateService, private injector: Injector,
              @Self() @Optional() ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    this.callValidator();
  }

  getRequired() {
    return typeof this.required === 'function' ? this.required() : this.required;
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
          multiple: this.multiple,
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

      // if (this.formControl.valid) {
      //     if (this.getRequired()) {
      //         if (this.value === undefined || this.value === null || this.value === '' || (this.multiple && this.value.length === 0)){
      //             this.formControl.setErrors({required: true});
      //         }
      //     }
      //
      //     this.formControl.markAllAsTouched();
      // }

    }
  }

  get selectedValue() {
    return this.value;
  }

  set selectedValue(val: any[] | any) {
    // this.writeValue(val); // Đọc comment bên dưới matSelectionChange
  }

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  writeValue(obj: any[] | any): void {
    // console.log('NsMultiSelectAutocomplete - writeValue: ', this.value, obj);
    if (obj != null && obj != undefined && this.value !== obj) {
      this.value = obj;
      // console.log('NsMultiSelectAutocomplete - writeValue: ', this.value);
      this.updateSelectAll();
      // this.formControl.setValue(this.value);
      this.propagateChange(this.value);
      this.callValidator();
      this.selectionChange.emit(this.value);
    }
    if (obj != null && obj != undefined && !((this.multiple && this.value.length === this.valueOptionRef.length)
      || (!this.multiple && this.valueOptionRef[0] && this.value === this.valueOptionRef[0].value))) {
      if (this.multiple) {
        this.valueOptionRef = this.options.filter(option => this.value.includes(option.value));
      } else {
        this.valueOptionRef = this.options.filter(option => this.value === option.value);
      }
      this.selectedOptionDataChange.emit(this.valueOptionRef);
    }
    this._displayString = this.onDisplayString();
    // console.log(this._displayString);
  }

  // private emitSelectedData(val: MatSelectChange) {
  //     if (val.value != null && val.value != undefined) {
  //         const dataArr: SelectModel[] = val.source._selectionModel.selected.map(matOption => {
  //             return this.options[Number(matOption._getHostElement().getAttribute('data-optionIndex'))];
  //         });
  //         this.selectedOptionDataChange.emit(dataArr);
  //     }
  // }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
    /*NON-EMPTY FOR COMPILE*/
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if ('options' in simpleChanges) {
      this.options = simpleChanges.options.currentValue;
      this.filteredOptions = this.options;
    }
    // console.log('NsMultiSelectAutocomplete - ngOnChanges: ', this.value, this.options);
    if (this.value != null && this.value != undefined) {
      this.writeValue(this.value);
    }
    // else if (this.formControl.value) {
    //     this.writeValue(this.formControl.value);
    // }
  }

  toggleSelectAll(val: MatCheckboxChange) {
    if (val.checked) {
      let tempChecked = this.value ? this.value : [];
      this.filteredOptions.forEach((option: SelectModel) => {
        if ((!this.value || (this.value && !this.value.includes(option.value))) && !option.disabled) {
          tempChecked = tempChecked.concat([option.value]);
        }
      });
      this.writeValue(tempChecked);
      this.selectedOptionDataChange.emit(this.filteredOptions.filter((option: SelectModel) => !option.disabled));
    } else {
      const filteredValues: any[] = [];
      this.filteredOptions.forEach((option: SelectModel) => {
        if (!option.disabled) {
          filteredValues.push(option.value);
        }
      });
      const filteredSelectedValue = this.value.filter(
        (item: any) => !filteredValues.includes(item),
      );
      this.writeValue(filteredSelectedValue);
      this.selectedOptionDataChange.emit([]);
    }
    this.selectionChange.emit(this.value);
  }

  filterItem(value: string) {
    this.filteredOptions = this.options.filter((item: SelectModel) => {
        const translatedDisplayValue = this.translateService.instant(item.displayValue);
        if (translatedDisplayValue) {
          return translatedDisplayValue.toLowerCase().indexOf(value.toLowerCase().trim()) > -1;
        } else {
          return item.displayValue.toLowerCase().indexOf(value.toLowerCase().trim()) > -1;
        }
      },
    );
    this.selectAllChecked = !!this.value;
    this.filteredOptions.forEach((item: SelectModel) => {
      if (this.value instanceof Array && !this.value.includes(item.value)) {
        this.selectAllChecked = false;
      }
    });
  }

  onDisplayString(): string {
    let _displayString = '';
    if (this.value !== null && this.value !== undefined && this.value !== ''
      && (!this.multiple || this.value.length > 0)) {
      let displayOptions = [];
      if (this.multiple) {
        // Multi select display
        for (let i = 0; i < this.labelCount; i++) {
          displayOptions[i] = this.options.filter(
            option => option.value === this.value[i],
          )[0];
        }
        if (displayOptions.length) {
          for (const displayOption of displayOptions) {
            _displayString += displayOption
              ? ((this.isTree ? this.onDisplayTreeData(displayOption.displayValue, true) : displayOption.displayValue) + ',')
              : '';
          }
          _displayString = _displayString.slice(0, -1);
          if (this.value.length > 1) {
            _displayString += ` (+${this.value.length - this.labelCount} others)`;
          }
        }
      } else {
        // Single select display
        displayOptions = this.options.filter(
          option => option.value === this.value,
        );
        if (displayOptions.length) {
          _displayString = this.isTree
            ? this.onDisplayTreeData(displayOptions[0].displayValue, true)
            : displayOptions[0].displayValue;
        }
      }
    }
    return _displayString;
  }

  /* Nếu không dùng virtual scroll thì mat-options trong mat-select được load hết
   * Khi toàn bộ mat-options được load hết thì mat-select-trigger sẽ lưu trữ được các giá trị đã chọn
   * Khi chọn 1 hay nhiều thì val.value sẽ là toàn bộ giá trị đã chọn
   */

  /* Khi dùng virtual scroll thì mình chỉ load nhẹ 1 mat-options đầu đã chọn để hack speed displayOptions
   * Khi đó khi chọn lại thì những mat-option không còn trong khung nhìn sẽ bị lỗi tick chọn nên ko dùng hàm này nữa
   */
  matSelectionChange(val: MatSelectChange) {
    // console.log('NsMultiSelectAutocomplete - onSelectionChange: ', val.value);
    // this.writeValue(val.value);
    // this.emitSelectedData(val);
  }

  onSelectionChange(change: MatOptionSelectionChange): void {
    if (!change.isUserInput) {
      return;
    }
    const value = change.source.value;
    if (!this.multiple) {
      this.writeValue(value);
      return;
    }

    const idx = this.value.indexOf(value);

    let tempChecked: any[] = this.value ? this.value : [];
    if (idx > -1) {
      tempChecked = tempChecked.filter(x => x !== value);
    } else {
      tempChecked = tempChecked.concat([value]);
    }

    this.writeValue(tempChecked);
  }

  updateSelectAll() {
    const filteredValues: any[] = [];
    this.filteredOptions.forEach((option: SelectModel) => {
      if (!option.disabled) {
        filteredValues.push(option.value);
      }
    });
    let count = 0;
    if (this.multiple && this.value && this.value instanceof Array && filteredValues) {
      this.value.forEach((item: any) => {
        count++;
      });
      this.selectAllChecked = count > 0 && count === filteredValues.length;
    }
  }

  onDisplayTreeData(displayValue: string, isFirstLine: boolean): string {
    const lastIndex = displayValue.lastIndexOf(this.treeSymbol.trim());
    if (lastIndex < 0) {
      return displayValue;
    }
    if (isFirstLine) {
      return this.translateService.instant(displayValue.substr(lastIndex).replace(this.treeSymbol.trim(), '').trim());
    } else {
      const preValue = displayValue.substr(0, lastIndex).trim();
      const preValues = preValue.split(this.treeSymbol.trim());
      let result = '';
      for (const value of preValues) {
        result += this.translateService.instant(value.trim()) + ' ' + this.treeSymbol.trim() + ' ';
      }
      return result ? result.substr(0, result.length - 4) : result;
    }
  }

  openChange($event: boolean) {
    if ($event && this.cdkVirtualScrollViewPort) {
      this.cdkVirtualScrollViewPort.scrollToIndex(0);
      this.cdkVirtualScrollViewPort.checkViewportSize();
    }
  }

  getItemSize(): number {
    return this.sizeOfItemsInListByPixels;
  }

  getViewPortHeight(): number {
    const numberOfItems = this.options.length > 10 ? 10 : this.options.length;
    const height = numberOfItems * this.sizeOfItemsInListByPixels;
    return height > 200 ? 200 : height;
  }
}
