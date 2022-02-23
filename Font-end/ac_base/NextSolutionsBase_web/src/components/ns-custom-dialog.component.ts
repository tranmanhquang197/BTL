import { Component, Inject, Injector, OnInit, Optional, Self } from '@angular/core';
import { InjectTokenNextSolutionsConfig, NextSolutionsConfig } from '../modules/next.solutions.config';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogTypeEnum } from '../models/enum/DialogTypeEnum';
import { TranslateService } from '@ngx-translate/core';
import { NsCustomDialogDataConfig } from '../models/ns.custom.dialog.data.config';

@Component({
    selector: 'ns-custom-dialog',
    template: `
        <div class="ns-custom-dialog dialog-content {{data.customClass}}" *ngIf="data"

             style="padding-bottom: 0px !important;"
             fxLayout="column">
            <div class="img"
                 fxLayoutAlign="center center"
                 fxLayout
                 *ngIf="config && config.DIALOG_LOGO">
                <img src="{{config.DIALOG_LOGO}}" alt="confirm-logo"/>
            </div>
            <div class="content"
                 fxLayoutAlign="start stretch"
                 fxLayout="column">
                <div class="text-msg">
                    {{data && data.msg ? data.msg : ''}}
                </div>
                <div class="text-msg-detail" *ngIf="data && data.msgDetail">
                    {{data.msgDetail}}
                </div>
                <!--                <div class="text-error" *ngIf="data.type === DialogTypeEnum.ERROR">-->
                <!--                    {{data && data.msg ? data.msg : ''}}-->
                <!--                </div>-->
                <!--                <div class="text-area" *ngIf="data.type === DialogTypeEnum.INPUT_CONFIRM"-->
                <!--                     fxLayoutAlign="center center"-->
                <!--                     fxLayout="column">-->
                <!--                    <label fxLayoutAlign="center center"-->
                <!--                           fxLayout>{{data && data.msg ? data.msg : ''}}</label>-->

                <mat-form-field appearance="outline" class="input-confirm-dialog" fxFlex="100%"
                                fxLayout="column" *ngIf="data.type === DialogTypeEnum.INPUT_CONFIRM">
                            <textarea matInput [(ngModel)]="inputText" fxFlex="100%"
                                      maxlength="{{(data && !!data.maxLength) ? data.maxLength : 524288}}"
                                      (ngModelChange)="onChangeInput()"></textarea>
                    <span *ngIf="!!data && !!data.maxLength" class="input-suffix"
                          matSuffix>{{(inputText?.length ? inputText.length : 0) + '/' + data.maxLength}}</span>
                    <mat-hint style="color: red" *ngIf="isError">{{errorInputText}}</mat-hint>
                </mat-form-field>
                <!--                </div>-->
            </div>
        </div>
        <hr class="display-hr-tag" *ngIf="data.type !== DialogTypeEnum.INPUT_CONFIRM">
        <div class="buttonArea margin-top-10">
            <button mat-button
                    class="{{data.btnCancelClass ? data.btnCancelClass : 'primary outline'}} btn-Cancel"
                    *ngIf="data.type !== DialogTypeEnum.ERROR"
                    (click)="onCancel()">
                <i *ngIf="!data.hideIconButton"
                   class="{{data.btnCancel_IconClass ? data.btnCancel_IconClass : 'fa fa-times' }}"></i> {{data && data.btnCancelString ? data.btnCancelString : ('common.Cancel' | translate)}}
            </button>
            <button mat-button
                    class="{{data.btnOKClass ? data.btnOKClass : 'primary'}} btn-OK"
                    (click)="onConfirm()">
                <i *ngIf="!data.hideIconButton"
                   class="{{data.btnOK_IconClass ? data.btnOK_IconClass : 'fa fa-check'}}"></i> {{data && data.btnOKString ? data.btnOKString : ('common.OK' | translate)}}
            </button>
        </div>

    `,
    styles: []
})
export class NsCustomDialogComponent implements OnInit, ControlValueAccessor {

    config: NextSolutionsConfig;

    get DialogTypeEnum() {
        return DialogTypeEnum;
    }

    inputText = '';
    errorInputText = '';
    isError = false;

    constructor(
        private translateService: TranslateService,
        private dialogRef: MatDialogRef<NsCustomDialogComponent>,
        private injector: Injector,
        @Self() @Optional() ngControl: NgControl,
        @Inject(MAT_DIALOG_DATA) public data: NsCustomDialogDataConfig) {
        if (ngControl) {
            // Hành động này thay cho provide: NG_VALUE_ACCESSOR và gắn ControlValueAccessor này vào parent FormControl
            ngControl.valueAccessor = this;
        }
        this.config = injector.get(InjectTokenNextSolutionsConfig);
    }

    writeValue(obj: any): void {
        this.inputText = obj;
    }
    propagateChange = (_: any) => {
        /*NON-EMPTY FOR COMPILE*/
    };
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    registerOnTouched(fn: any): void {

    }

    ngOnInit(): void {
    }

    onConfirm() {
        if (this.data && this.data.type) {
            if (this.data.type === DialogTypeEnum.INPUT_CONFIRM) {
                this.isError = !this.inputText.trim();
                if (this.isError) {
                    this.errorInputText = !!this.data?.errorMsg ? this.translateService.instant(this.data.errorMsg) : this.translateService.instant('common.required');
                    return;
                }
                this.dialogRef.close({value: this.inputText});
            } else {
                this.dialogRef.close({value: 1});
            }
        }
    }

    onCancel() {
        this.dialogRef.close();
    }

    onChangeInput() {
        this.isError = !this.inputText.trim();
        if (this.isError) {
            this.errorInputText = !!this.data?.errorMsg ? this.translateService.instant(this.data.errorMsg) : this.translateService.instant('common.required');
        }
    }
}
