import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, UtilsService} from '@next-solutions/next-solutions-base';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpParams} from "@angular/common/http";

export class DialogImportFileDataConfig {
  downloadTemplateFunc?: () => void;
  importFunc?: (file: File | undefined) => Observable<any>;
  downloadErrorFile?: () => void;
  confirmMsgKey = '';
  successMsgKey = '';
  errorMsgKey = '';
}

@Component({
  selector: 'app-dialog-import-file',
  template: `
    <div>
      <h2>{{'common.label.import.file' | translate}}</h2>
      <h4>{{'common.label.import.file.detail' | translate}}</h4>
      <div appDragDrop class="areaImportFile" (onFileDropped)="onDropped($event)"
           (click)="onClickChooseFile(inputFile)">
        <input class="d-zone" type="file"
               #inputFile
               (change)="onFileChange($event, inputFile)">
        <span><!--
          (click)="onClickChooseFile(inputFile)"-->
          <i class="fal fa-plus mr-2"></i> {{'common.label.import.file.drag.drop' | translate}}
        </span>
      </div>
      <h4 style="width: 26rem">
        {{file?.name}}
      </h4>
      <div class="but">
        <button mat-button (click)="close()" type="button" class="primary outline">
          {{'btnCancel' | translate}}
        </button>
        <button mat-button type="button" (click)="onImport()" class="primary">
          {{'btnImport' | translate}}
        </button>
        <button mat-button *ngIf="errorImportExcelUrl" (click)="downloadErrorFile()" type="button"
                class="danger">
          {{'common.button.download.error.file' | translate}}
        </button>
      </div>

<!--      <div class="download-template"><p>{{'common.label.not.template' | translate}}</p><span-->
<!--        (click)="downloadTemplate()">{{'common.label.download.template' | translate}}</span></div>-->
    </div>    
  
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 !important;
    }

    h2, h4 {
      margin: 2rem;
      text-align: center;
    }

    p {
      display: inline;
      text-align: center;
    }

    span {
      color: #3366FF;
      cursor: pointer;
      text-align: center;
    }

    .d-zone {
      display: none;
    }

    .areaImportFile {
      width: 26rem;
      height: 10rem;
      background: #FFFFFF;
      border: 1px dashed #3366FF;
      background-color: white !important;
      box-sizing: border-box;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2rem;
      cursor: pointer;
    }

    .but {
      margin: 2rem;
      display: flex;
      justify-content: center;
    }

    .download-template {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class DialogImportFileComponent implements OnInit {
  file?: File;
  errorImportExcelUrl = '';
  @ViewChild('inputFile', {static: false}) inputFileRef?: ElementRef<any>;

  constructor(private matDialogRef: MatDialogRef<DialogImportFileComponent>,
              private apiService: ApiService,
              private utilsService: UtilsService,
              @Inject(MAT_DIALOG_DATA) public data: DialogImportFileDataConfig) {
  }

  ngOnInit(): void {
  }

  onDropped(fileList: FileList) {
    this.handleFile(fileList);
  }

  onFileChange(event: any, inputRef: HTMLInputElement) {
    const files = event.target.files;
    this.handleFile(files);
  }

  downloadTemplate() {
    if (this.data.downloadTemplateFunc)
      this.data.downloadTemplateFunc();
  }

  private handleFile(files: FileList) {
    if (files && files.length) {
      const file = files[0];
      const af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (file.type === af[0]) {
        this.file = file;
      } else {
        this.utilsService.showWarningToarst('Only allow excel doc');
      }
    }
  }

  onClickChooseFile(inputFile: HTMLInputElement) {
    inputFile.click();
  }

  close() {
    this.matDialogRef.close();
  }

  onImport() {
    this.utilsService.showConfirmDialog(this.data.confirmMsgKey, [])
      .afterClosed().subscribe((value: any) => {
      if (value.value) {
        if (this.data.importFunc) {
          this.data.importFunc(this.file).subscribe((data: any) => {
              if (data) {
                this.utilsService.onSuccessFunc(this.data.successMsgKey);
                this.matDialogRef.close({done: true});
              }
            },
            error => {
              this.utilsService.showErrorToarst(this.data.errorMsgKey);
              this.errorImportExcelUrl = error;
              (this.inputFileRef?.nativeElement as any).value = '';
              this.file = undefined;
            });
        }
      }
    });
  }

  downloadErrorFile() {
    if (this.data.downloadErrorFile) {
      this.data.downloadErrorFile();
    }else {
      this.onDownloadErrorFile();
    }
  }

  onDownloadErrorFile() {
    const body = {
      errorTempalteUrl: this.errorImportExcelUrl
    }
    this.apiService.saveFile('/downloadErrorExcel' , body, {}, environment.BASE_CHAT_URL);
  }
}
