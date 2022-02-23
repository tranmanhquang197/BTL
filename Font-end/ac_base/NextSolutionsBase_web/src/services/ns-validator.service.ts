import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ColumnFields } from '../models/column.fields';
import { ColumnTypes } from '../models/enum/column.types';
import { TableService } from './table.service';
import { DateRangePickerModel } from '..';

@Injectable()
export class NsValidator {

  static invalid(control: AbstractControl | undefined): boolean {
    return !!control && control.dirty ? control.invalid : false;
  }

  static getErrorMessage(control: AbstractControl | undefined, errorMessages: Map<string, (e?: any) => string>): string {
    if (!control) {
      return '';
    }
    const { errors } = control;

    const messages: string[] = errors ? Object.keys(errors).map(key => {
      const fn = errorMessages.has(key) ? errorMessages.get(key) : null;
      return fn ? fn(errors) : 'common.error.' + key;
    }) : [];
    return messages && messages.length > 0 ? messages[0] : '';
  }


  static getErrorMessageV1(control?: AbstractControl, errorMessages?: Map<string, (e?: any) => string>): any {
    if (!control) {
      return '';
    }
    const { errors } = control;
    if (!errors) {
      return {};
    }
    let errKey = Object.keys(errors)[0];
    const fn = errorMessages && errorMessages.has(errKey) ? errorMessages.get(errKey) : null;
    const msg = fn ? fn(errors) : 'common.error.' + errKey;
    // const messages: string[] = errors ? Object.keys(errors).map(key => {
    //   const fn = errorMessages.has(key) ? errorMessages.get(key) : null;
    //   errKey = key;
    //   return fn ? fn(errors) : 'common.error.' + key;
    // }) : [];
    return errors && msg ? { msg, params: errors[errKey] } : {};
  }

  static generateNsMultiSelectValidators(conditions: {
    required?: boolean | (() => boolean),
    multiple?: boolean
  }): ValidatorFn[] {
    const validationFns: ValidatorFn[] = [];
    const validation = (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (NsValidator.getRequiredDynamic(conditions.required) && (value === undefined || value === null || value === ''
        || (!!conditions.multiple && value.length === 0))) {
        return { required: true };
      }
      return null;
    };
    validationFns.push(validation);
    return validationFns;
  }

  static generateNsInputValidators(conditions: {
    required: boolean | (() => boolean),
    minLength: number | undefined,
    maxLength: number | undefined,
    pattern: string | undefined
  }): ValidatorFn[] {
    const validationFns: ValidatorFn[] = [];

    if (conditions.required) {
      validationFns.push(Validators.required);
    }
    if (conditions.minLength) {
      validationFns.push(Validators.minLength(conditions.minLength));
    }
    if (conditions.maxLength) {
      validationFns.push(Validators.maxLength(conditions.maxLength));
    }

    if (conditions.pattern) {
      validationFns.push(Validators.pattern(conditions.pattern));
    }
    return validationFns;
  }

  static getMinMaxDynamic(minOrMax: (() => number) | number | null) {
    return minOrMax !== null ? typeof (minOrMax) === 'function' ? minOrMax() : minOrMax : null;
  }

  static generateNsCounterInputValidators(conditions: {
    required?: boolean | (() => boolean),
    min: (() => number) | number | null,
    max: (() => number) | number | null,
    isDecimal?: boolean | null
  }): ValidatorFn[] {
    const validationFns: ValidatorFn[] = [];
    validationFns.push(Validators.pattern(conditions.isDecimal ? '^[^-]?[0-9]+[.]?[0-9]*$' : '^[0-9]*$'));
    if (conditions.required) {
      validationFns.push(Validators.required);
    }
    if (conditions.min != undefined && conditions.min != null) {
      const validationMin = (control: AbstractControl): ValidationErrors | null => {
        return NsValidator.customMinValueNsCounterInput(control.value, NsValidator.getMinMaxDynamic(conditions.min));
      };
      validationFns.push(validationMin);
    }
    if (conditions.max != undefined && conditions.max != null) {
      const validationMax = (control: AbstractControl): ValidationErrors | null => {
        return NsValidator.customMaxValueNsCounterInput(control.value, NsValidator.getMinMaxDynamic(conditions.max));
      };
      validationFns.push(validationMax);
    }
    return validationFns;
  }

  static generateNsDatePickerValidators(conditions: { required?: boolean | (() => boolean), min: Date | null, max: Date | null }): ValidatorFn[] {
    const validationFns: ValidatorFn[] = [];
    if (conditions.required) {
      validationFns.push(Validators.required);
    }
    // if (conditions.min) {
    //     validationFns.push(new NsValidator({minDate: conditions.min}).customMinDateValidator());
    // }
    // if (conditions.max) {
    //     validationFns.push(new NsValidator({maxDate: conditions.max}).customMaxDateValidator());
    // }
    return validationFns;
  }

  static getRequiredDynamic(isRequired?: boolean | (() => boolean)) {
    return isRequired ? typeof (isRequired) === 'boolean' ? isRequired : isRequired() : false;
  }

  static generateNsDateRangePickerValidators(conditions: {
    requiredFromDate: boolean | (() => boolean),
    requiredToDate: boolean | (() => boolean),
  }): ValidatorFn[] {
    const validationFns: ValidatorFn[] = [];
    // if (NsValidator.getRequiredDynamic(conditions.requiredFromDate)
    //     || NsValidator.getRequiredDynamic(conditions.requiredToDate)) {
    const validation = (control: AbstractControl): ValidationErrors | null => {
      const range = control.value as DateRangePickerModel;
      if (!range?.fromDate && NsValidator.getRequiredDynamic(conditions.requiredFromDate)) {
        return { requiredFromDate: true };
      }
      if (!range?.toDate && NsValidator.getRequiredDynamic(conditions.requiredToDate)) {
        return { requiredToDate: true };
      }
      return null;
    };
    validationFns.push(validation);
    // }
    return validationFns;
  }

  // customMinDateValidator(): ValidatorFn {
  //     return this.customMinDateValidatorControl;
  // }

  static customMinDateValidatorControl(value: string | any, minDate: Date | null): ValidationErrors | null {
    if (!minDate || !value) {
      return null;
    }
    let date = value instanceof Date ? value : new Date((value as string).replace(' ', 'T'));
    if (date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0)) {
      return { min: { valid: false, minValue: minDate, actual: date } };
    }
    return null;
  }

  // customMaxDateValidator(): ValidatorFn {
  //     return this.customMaxDateValidatorControl;
  // }

  static customMaxDateValidatorControl(value: string | any, maxDate: Date | null): ValidationErrors | null {
    if (!maxDate || !value) {
      return null;
    }
    let date = value instanceof Date ? value : new Date((value as string).replace(' ', 'T').replace('Z', ''));
    if (date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0)) {
      return { max: { valid: false, maxValue: maxDate, actual: date } };
    }
    return null;
  }

  static getRequired(column: ColumnFields) {
    return column.isRequired ? typeof (column.isRequired) === 'boolean' ? column.isRequired : column.isRequired() : false;
  }

  static getIsDecimal(column: ColumnFields) {
    return column.isDecimal ? typeof (column.isDecimal) === 'boolean' ? column.isDecimal : column.isDecimal() : false;
  }

  static customMinValueNsCounterInput(value: number | any, min: number | null): ValidationErrors | null {
    if (!isNaN(Number(value)) && min !== null && value < min) {
      return { min: { min: min, actual: value } };
    }
    return null;
  }

  static customMaxValueNsCounterInput(value: number | any, max: number | null): ValidationErrors | null {
    if (!isNaN(Number(value)) && max !== null && value > max) {
      return { max: { max: max, actual: value } };
    }
    return null;
  }

  static generateNsSmartTableValidators(conditions: { columns: ColumnFields[], minRow: number, maxRow: number }): ValidatorFn {
    const validator = (control: AbstractControl): ValidationErrors | null => {
      let errors: any = null;
      if (control) {
        // console.log('NsSmartTable - validate', control);
        const controlValueLength: number = control.value ? control.value.length : 0;
        if (conditions.minRow > controlValueLength) {
          return { minRow: { valid: false, min: conditions.minRow, actual: controlValueLength } };
        }
        if (conditions.maxRow < controlValueLength) {
          return { maxRow: { valid: false, max: conditions.maxRow, actual: controlValueLength } };
        }
        if (!control.value) {
          return null;
        }
        control.value.forEach((row: any) => {
          // console.log('NsSmartTable - validate - errors: ', errors);
          if (errors || !conditions.columns) {
            return;
          }
          conditions.columns.forEach((column: ColumnFields) => {
            if (errors) {
              return;
            }
            // console.log('NsSmartTable - validate - value+columns: ', row, column);
            const tempControl = new FormControl();
            tempControl.setValue(row[column.columnDef]);
            if (TableService.getColumnType(column, row) === ColumnTypes.MULTI_SELECT_AUTOCOMPLETE) {
              if (NsValidator.getRequired(column)) {
                tempControl.setValidators(Validators.required);
              }
            } else if (TableService.getColumnType(column, row) === ColumnTypes.INPUT_COUNTER) {
              tempControl.setValidators(NsValidator.generateNsCounterInputValidators({
                required: NsValidator.getRequired(column),
                min: null,
                max: null,
                isDecimal: NsValidator.getIsDecimal(column),
              }));
            } else if (TableService.getColumnType(column, row) === ColumnTypes.DATE_PICKER) {
              tempControl.setValidators(NsValidator.generateNsDatePickerValidators({
                required: NsValidator.getRequired(column),
                min: null,
                max: null,
              }));
            } else if (TableService.getColumnType(column, row) === ColumnTypes.INPUT) {
              tempControl.setValidators(NsValidator.generateNsInputValidators({
                required: NsValidator.getRequired(column),
                maxLength: column.max ? column.max(row) : undefined,
                minLength: column.min ? column.min(row) : undefined,
                pattern: undefined
              }));
            }
            tempControl.updateValueAndValidity();
            if (TableService.getColumnType(column, row) === ColumnTypes.DATE_PICKER) {
              const errorsArr = [];
              if (tempControl.errors) {
                errorsArr.push(tempControl.errors);
              }

              if (NsValidator.customMinDateValidatorControl(tempControl.value, column.min ? column.min(row) : null)) {
                errorsArr.push(NsValidator.customMinDateValidatorControl(tempControl.value, column.min ? column.min(row) : null));
              }

              if (NsValidator.customMaxDateValidatorControl(tempControl.value, column.max ? column.max(row) : null)) {
                errorsArr.push(NsValidator.customMaxDateValidatorControl(tempControl.value, column.max ? column.max(row) : null));
              }

              if (errorsArr.length > 0) {
                tempControl.setErrors(errorsArr);
              }
            }
            if (TableService.getColumnType(column, row) === ColumnTypes.INPUT_COUNTER) {
              const errorsArr = [];
              if (tempControl.errors) {
                errorsArr.push(tempControl.errors);
              }

              if (NsValidator.customMinValueNsCounterInput(tempControl.value, column.min ? column.min(row) : null)) {
                errorsArr.push(NsValidator.customMinValueNsCounterInput(tempControl.value, column.min ? column.min(row) : null));
              }

              if (NsValidator.customMaxValueNsCounterInput(tempControl.value, column.max ? column.max(row) : null)) {
                errorsArr.push(NsValidator.customMaxValueNsCounterInput(tempControl.value, column.max ? column.max(row) : null));
              }

              if (errorsArr.length > 0) {
                tempControl.setErrors(errorsArr);
              }
            }

            tempControl.markAllAsTouched();
            // console.log('NsSmartTable - validate - tempControl.errors: ', TableService.getColumnType(column,row), row[column.columnDef], tempControl.errors);
            errors = tempControl.errors;
          });
        });
      }
      return errors;
    };
    return validator;
  }
}
