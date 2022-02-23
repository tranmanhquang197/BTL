import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { Paging } from '../models/Paging';
import { SuperEntity } from '../models/SuperEntity';
import { AbstractControl, FormArray, FormControl, FormGroup, NgControl } from '@angular/forms';
import { SelectModel } from '../models/select.model';
import { TreeFields } from '../models/tree.fields';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {NsCustomDialogComponent} from '../components/ns-custom-dialog.component';
import { DialogTypeEnum } from '../models/enum/DialogTypeEnum';
import {NsCustomDialogDataConfig} from "../models/ns.custom.dialog.data.config";
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class UtilsService {

  constructor(
    private dialog: MatDialog,
    private transService: TranslateService, private toastr: ToastrService) {
  }

  public strFormat(str: string, replacement?: string[]) {
    let a = this.transService.instant(str);
    if (replacement === null || replacement === undefined || replacement.length === 0) {
      return a;
    }
    replacement.forEach((value, index) => {
      a = a.replace('{' + index + '}', this.transService.instant(value));
    });
    return a;
  }

  public onSuccessFunc = (onSuccessMessage?: string): void => {
    if (onSuccessMessage) {
      const msg = this.transService.instant(onSuccessMessage);
      this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
      this.toastr.success(msg);
    }
  };

  public showWarningToarst(msgKey: string, replacement?: string[]) {
    const msg = this.strFormat(msgKey, replacement);
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
    this.toastr.warning(msg);
  }

  public showErrorToarst(msgKey: string, replacement?: string[]) {
    const msg = this.strFormat(msgKey, replacement);
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
    this.toastr.error(msg);
  }

  public showError = (err: string): void => {
    let errLocale = '';
    if (err !== undefined && err !== null) {
      errLocale = this.transService.instant(err);
    }
    this.dialog.open(NsCustomDialogComponent, {
      width: '500px',
      data: {
        msg: `${errLocale}`,
        type: DialogTypeEnum.ERROR,
      },
    });
  };

  public execute3(apiCall: any, onSuccessFunc: (this: void, data: any, onSuccessMessage?: string) => void, onSuccessMessage: string,
                  onErrorFunc?: (err: any) => void) {

    if (!apiCall) {
      if (onSuccessFunc) {
        onSuccessFunc(null);
      }
      return;
    }
    apiCall.subscribe((data: any) => {
      if (onSuccessFunc) {
        if (onSuccessMessage) {
          onSuccessFunc(data, onSuccessMessage);
        } else {
          onSuccessFunc(data);
        }
      } else {
        this.onSuccessFunc(onSuccessMessage);
      }
    }, (error1: any) => {
      if (error1 !== '401') {
        if (!!onErrorFunc) {
          onErrorFunc(error1);
        } else {
          this.showError(error1);
        }

      }
    });
  }

  public execute(apiCall: any, onSuccessFunc: (this: void, d: any, onSuccessMessage?: string) => void, onSuccessMessage: string,
                 confirmMsgTitle: string, confirmMsgTitleParamsFormat: string[] = [],
                 confirmMsgDetail: string = '', confirmMsgDetailParamsFormat: string[] = [],
                 confirmDialogConfig: MatDialogConfig<NsCustomDialogDataConfig> | undefined = undefined,
                 confirmDialogButtonOk: string = 'common.OK', confirmDialogButtonCancel: string = 'common.Cancel',
  ) {
    if (confirmMsgTitle !== undefined && confirmMsgTitle !== null && confirmMsgTitle !== '') {
      this.showConfirmDialog(confirmMsgTitle, confirmMsgTitleParamsFormat, confirmMsgDetail, confirmMsgDetailParamsFormat,
          confirmDialogConfig, confirmDialogButtonOk, confirmDialogButtonCancel)
        .afterClosed().subscribe(result => {
        if (result && result.value) {
          this.execute3(apiCall, onSuccessFunc, onSuccessMessage);
        }
      });
    } else {
      this.execute3(apiCall, onSuccessFunc, onSuccessMessage);
    }
  }

  public executeWithErrorHandle(method: () => Observable<any>,
                                onSuccessFunc: (this: void, d: any, onSuccessMessage?: string) => void,
                                onSuccessMessage: string,
                                confirmMsgTitle: string,
                                confirmMsgParamsFormat: string[] = [],
                                confirmMsgDetail: string = '',
                                confirmMsgDetailParamsFormat: string[] = [],
                                onErrorFunc: ((err: any) => void) | undefined,
                                dialogConfig?: MatDialogConfig<NsCustomDialogDataConfig>,
                                confirmDialogButtonOk: string = 'common.OK', confirmDialogButtonCancel: string = 'common.Cancel',
  ) {

    if (confirmMsgTitle !== undefined && confirmMsgTitle !== null && confirmMsgTitle !== '') {
      this.showConfirmDialog(confirmMsgTitle, confirmMsgParamsFormat, confirmMsgDetail, confirmMsgDetailParamsFormat, dialogConfig,
          confirmDialogButtonOk, confirmDialogButtonCancel)
          .afterClosed().subscribe((result: any) => {
        if (result && result.value) {
          this.execute3(method(), onSuccessFunc, onSuccessMessage, onErrorFunc);
        }
      });
    } else {
      this.execute3(method(), onSuccessFunc, onSuccessMessage, onErrorFunc);
    }
  }

  public showConfirmDialog(strTitle: string, replacementTitle: string[],
                           strDetailMsg: string = '', replacementDetail: string[] = [],
                           confirmDialogConfig: MatDialogConfig<NsCustomDialogDataConfig> | undefined = undefined,
                           strOkText: string = 'common.OK', strCancelTex: string = 'common.Cancel',strCustomClass?:string
  ) {
    const msgTitle = this.strFormat(strTitle, replacementTitle);
    const msgDetail = !!strDetailMsg ? this.strFormat(strDetailMsg, replacementDetail) : '';
    const strOk = this.transService.instant(strOkText);
    const strCancel = this.transService.instant(strCancelTex);
    const re = /\./gi;
    const customClass = (strCustomClass?strCustomClass:strTitle).replace(re, "-");
    return this.dialog.open(NsCustomDialogComponent, confirmDialogConfig ? confirmDialogConfig : {
      width: '500px',

      data: {
        customClass:customClass,
        msg: msgTitle,
        msgDetail: msgDetail,
        type: DialogTypeEnum.CONFIRM,
        btnOKString: strOk,
        btnCanceString: strCancel,
      } as NsCustomDialogDataConfig,
    });
  }

  public showConfirmInputDialog(str1: string, replacement: string[],
                                confirmInputDialogConfig: MatDialogConfig<NsCustomDialogDataConfig> | undefined = undefined,
                                strOkText: string = 'common.OK', strCancelTex: string = 'common.Cancel',strCustomClass?:string
  ) {
    const str = this.strFormat(str1, replacement);
    const strOk = this.transService.instant(strOkText);
    const strCancel = this.transService.instant(strCancelTex);
    const re = /\./gi;
    const customClass = (strCustomClass?strCustomClass:str1).replace(re, "-");

    return this.dialog.open(NsCustomDialogComponent,
        confirmInputDialogConfig ? confirmInputDialogConfig : {
          width: '500px',

          data: {
            customClass:customClass,
            msg: str,
            type: DialogTypeEnum.INPUT_CONFIRM,
            btnOKString: strOk,
            btnCancelString: strCancel,
          } as NsCustomDialogDataConfig,
        });
  }

  public getEnumValueTranslated<T>(o: T, value: string): { [P in keyof T]: T[P] }[keyof T] {
    const key = (o as any)['_' + value]; // No type safety here unfrotunately
    return this.transService.instant(key);
  }

  public toBlobJon(obj: any): Blob {
    return new Blob([JSON.stringify(obj)], {
      type: 'application/json',
    });
  }

  static getEnumValue<T>(o: T, value: string): { [P in keyof T]: T[P] }[keyof T] {
    return (o as any)['_' + value]; // No type safety here unfrotunately
  }

  static calcPosition(e: any, results: MatTableDataSource<SuperEntity>, paging: Paging) {
    return (paging ? ((paging.pageNumber - 1) * paging.pageSize) : 0) + (results.data.indexOf(e) + 1);
  }

  static reduceEntityAttributeForFormControl(formGroup: FormGroup, e: any,
                                             dateRangeConfigList?: {dateRangeControlName: string, fromDateControlName: string, toDateControlName:string}[]) {
    return Object.keys(formGroup.controls).reduce(reduceEntityAttributeForFormControlByControlName, {});

    function reduceEntityAttributeForFormControlByControlName(formControl: any, ctrlName: string) {
      if (e) {
        let includesOfDateRangeConfig = false;
        if (dateRangeConfigList) {
          for (const dateRangeConfig of dateRangeConfigList) {
            if (dateRangeConfig
                && [dateRangeConfig.dateRangeControlName,
                  dateRangeConfig.fromDateControlName, dateRangeConfig.toDateControlName].includes(ctrlName)) {
              includesOfDateRangeConfig = true;
              switch (ctrlName) {
                case dateRangeConfig.dateRangeControlName:
                  formControl[ctrlName] = {
                    fromDate: e[dateRangeConfig.fromDateControlName] ? e[dateRangeConfig.fromDateControlName] : null,
                    toDate: e[dateRangeConfig.toDateControlName] ? e[dateRangeConfig.toDateControlName] : null
                  };
                  break;
                case dateRangeConfig.fromDateControlName:
                  formControl[ctrlName] = e[ctrlName];
                  if (formControl[dateRangeConfig.dateRangeControlName]
                      && typeof (formControl[dateRangeConfig.dateRangeControlName]) === 'object') {
                    formControl[dateRangeConfig.dateRangeControlName].fromDate = e[ctrlName];
                  }
                  break;
                case dateRangeConfig.toDateControlName:
                  formControl[ctrlName] = e[ctrlName];
                  if (formControl[dateRangeConfig.dateRangeControlName]
                      && typeof (formControl[dateRangeConfig.dateRangeControlName]) === 'object') {
                    formControl[dateRangeConfig.dateRangeControlName].toDate = e[ctrlName];
                  }
                  break;
                default:
                  break;
              }
            }
          }
        }
        if (!includesOfDateRangeConfig) {
          if (typeof (e[ctrlName]) === 'boolean') {
            formControl[ctrlName] = e[ctrlName] ? '1' : '0';
          } else if (e[ctrlName] instanceof Array) {
            formControl[ctrlName] = e[ctrlName];
          } else if (typeof (e[ctrlName]) === 'object') {
            formControl[ctrlName] = e[ctrlName]
                ? (e[ctrlName].id
                    ? e[ctrlName].id
                    : (e[ctrlName].code ? e[ctrlName].code : ''))
                : null;
          } else {
            formControl[ctrlName] = (e[ctrlName] != null && e[ctrlName] != undefined) ? e[ctrlName] : '';
          }
        }
      } else {
        formControl[ctrlName] = '';
      }
      return formControl;
    }
  }

  static cloneAbstractControl<T extends AbstractControl>(control: T): T | undefined {
    let newControl: T | undefined;

    if (control instanceof FormGroup) {
      const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;
      if (controls) {
        Object.keys(controls).forEach(key => {
          const tempControl: AbstractControl | undefined = UtilsService.cloneAbstractControl(controls[key]);
          if (tempControl) {
            formGroup.addControl(key, tempControl);
          }
        });
      }
      newControl = formGroup as any;
    } else if (control instanceof FormArray) {
      const formArray = new FormArray([], control.validator, control.asyncValidator);
      const controls = control.controls;
      if (controls) {
        controls.forEach(formControl => {
          const tempControl: AbstractControl | undefined = UtilsService.cloneAbstractControl(formControl);
          if (tempControl) {
            formArray.push(tempControl);
          }
        });
      }
      newControl = formArray as any;
    } else if (control instanceof FormControl || control instanceof NgControl) {
      newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
    } else {
      console.error('Error: unexpected formControl value', control);
    }

    if (control.disabled && newControl) newControl.disable({ emitEvent: false });

    return newControl;
  }

  static convertTreeDataToAutocompleteData(treeFields: TreeFields,
                                           symbol: string,
                                           hasChildFn: (_: number, node: any) => boolean,
                                           nodes: SuperEntity[],
                                           prefixValue: string | null,
                                           prefixDisplayValue: string | null): SelectModel[] {
    let result: SelectModel[] = [];
    if (treeFields) {
      for (const node of nodes) {
        // const value = prefixValue ? prefixValue + '.' + this._treeFields.value(node).toString() : this._treeFields.value(node).toString();
        const value = treeFields.value(node).toString();
        const displayValue = prefixDisplayValue ? prefixDisplayValue + symbol + treeFields.display(node) : treeFields.display(node);
        const hasChild = hasChildFn(0, node);
        if (hasChild) {
          const childen = treeFields.children(node);
          result.push(...this.convertTreeDataToAutocompleteData(treeFields, symbol, hasChildFn, childen, value, displayValue));
        } else {
          result.push(new SelectModel(value, displayValue, hasChild, node));
        }
      }
    }
    return result;
  }
}
