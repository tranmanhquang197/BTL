import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadModel } from '../../models/upload.model';

@Component({
  selector: 'ns-multi-upload',
  template: `
    <div class="ns-multi-upload"
         fxLayout="row" fxLayout.lt-sm="row wrap">
      <mat-label *ngIf="label" class="label_width"
                 fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
        <div class="label">{{(label ? label : '') | translate}}<span class="required-label-outside">{{!!required ? '*' : ''}}</span></div>
      </mat-label>
      <div class="uploadArea"
           fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%"
           appDragDrop (onFileDropped)="onFileDroppedAction($event)">
        <input type="file" multiple #fileUpload (change)="onFileChangeAction($event)"
               [disabled]="disabled"
               accept="{{accept ? accept.join() : '*/*'}}">
        <mat-card>
          <mat-card-actions>
            <button mat-button class="upload-button" color="warn" (click)="onClick()">
              <mat-icon>add</mat-icon>
              <span>{{'common.upload.file' | translate}}</span>
            </button>
          </mat-card-actions>
          <mat-card-content>
          </mat-card-content>
        </mat-card>
        <mat-error *ngIf="sizeError!==null">{{sizeError + ' ' + ('common.is.over-size' | translate)}}</mat-error>
        <mat-error *ngIf="typeError!==null">{{typeError + ' ' + ('common.is.not-accept' | translate)}}</mat-error>
      </div>
    </div>
  `,
  // styleUrls: ['../../styles/ns-style/ns-multi-upload.scss'],
  providers:
    [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NsMultiUpload),
        multi: true,
      },
    ],
})

export class NsMultiUpload implements ControlValueAccessor {
  @ViewChild('fileUpload', { static: false }) fileUpload?: ElementRef;
  @Input() files: UploadModel[] = [];
  @Input() multiple: boolean = false;
  @Input() maxSize: number | null = null;
  @Input() accept: string[] | null = null;
  @Input() label: string = '';
  @Input() required: string = '';
  @Input() disabled: boolean = false;
  /* percent label outside css */
  @Input() percentOfLabelOutside: number = 25;


  @Output() onFileChange = new EventEmitter();
  sizeError: string | null = null;
  typeError: string | null = null;

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  writeValue(obj: any): void {
    if (!obj) {
      return;
    }
    if (this.multiple) {
      this.files.push(obj);
    } else {
      this.files = [obj];
    }
    this.propagateChange(this.files);
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
    /*NON-EMPTY FOR COMPILE*/
  }

  onClick() {
    const fileUpload = this.fileUpload?.nativeElement;
    fileUpload.click();
  }

  convertToUploadModel(fileList: FileList): void {
    this.sizeError = null;
    this.typeError = null;
    if (fileList && fileList[0]) {
      if (!this.validFile(fileList)) {
        return;
      }
      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];
        if (this.isContainFileName(file.name)) {
          continue;
        }
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.writeValue(new UploadModel(file.name, file, (event.target as FileReader).result));
          if (!this.multiple || i === fileList.length - 1) {
            this.onFileChange.emit();
          }
        };
        reader.readAsDataURL(file);
        if (!this.multiple) {
          break;
        }
      }
    }
  }

  isContainFileName(name: string): boolean {
    for (const file of this.files) {
      if (file.name === name) {
        return true;
      }
    }
    return false;
  }

  onFileChangeAction(event: any) {
    const target = event.target as HTMLInputElement;
    if (target && target.files){
      this.convertToUploadModel(target.files);
    }
  }

  onFileDroppedAction(fileList: FileList) {
    this.convertToUploadModel(fileList);
  }

  validFile(fileList: FileList): boolean {
    const acceptStr = this.accept ? this.accept.join() : '';
    for (let i = 0; i < fileList.length; i++) {
      const file: File = fileList[i];
      if (acceptStr.indexOf(file.type) < 0 || !file.type || file.type === '') {
        this.typeError = file.name;
        return false;
      }
      if (this.maxSize && file.size > this.maxSize) {
        this.sizeError = file.name;
        return false;
      }
    }
    return true;
  }
}
