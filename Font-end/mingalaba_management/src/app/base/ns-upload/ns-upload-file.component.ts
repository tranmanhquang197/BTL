import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {ApiService, UploadModel} from '@next-solutions/next-solutions-base';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {FileSaverService} from "ngx-filesaver";


export class DeleteFileEventModel {
  ngControl: NgControl | undefined;
  file: UploadModel | undefined
}

@Component({
  selector: 'ns-upload-file',
  template: `
    <div class="ns-multi-upload labelOutside"
         fxLayout="row" fxLayout.lt-sm="row wrap">
      <mat-label *ngIf="label" class="label_width"
                 fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
        <div class="label">{{(label ? label : '') | translate}}<span
          class="required-label-outside">{{!!required ? '*' : ''}}</span></div>
      </mat-label>
      <div class="uploadArea" style="background-color: #FFFFFF"
           fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%"
           appDragDrop (onFileDropped)="onFileDroppedAction($event)">
        <input type="file" #fileUpload (change)="onFileChangeAction($event)"
               [disabled]="disabled"
               accept="{{accept ? accept.join() : '*/*'}}">
        <mat-card>
          <mat-card-actions>
            <div fxLayout="column">
              <button mat-button
                      class="{{(isImageType() && files[0])?'upload-button preview': 'upload-button'}}"
                      color="warn" (click)="onClick()">
                <div class="preview-image"
                     *ngIf="isImageType() && files[0]">
                  <img (load)="onLoad(img, $event)"
                       #img
                       style="display: none"
                       [src]="getSrcImg()"
                       *ngIf="isImageType() && files[0]"
                  />
                </div>
                <i [ngClass]="files[0]?'fa fa-file-alt':'fa fa-plus'"
                   *ngIf="!isImageType()  || !files[0]"></i>
                <span
                  *ngIf="!files[0]">{{((placeholder ? placeholder : 'common.button.import.file')| translate)}}</span>

                <i *ngIf="!!files[0]?.previewValue && !isImageType()" class="fa fa-eye"
                   (click)="previewFiles($event, downloadId)">
                  <a download (click)="downloadFile()" #downloadId style="display:none;"></a>
                </i>
                <i *ngIf="files[0] && !disabled" class="fa fa-trash-alt" (click)="removeFiles($event, this)"></i>
              </button>
            </div>
            <mat-label>{{fileName}}</mat-label>
          </mat-card-actions>

          <mat-card-content>

          </mat-card-content>
        </mat-card>
        <mat-error *ngIf="sizeError!==null">{{sizeError + ' ' + ('common.is.over-size' | translate)}}</mat-error>
        <mat-error *ngIf="typeError!==null">{{typeError + ' ' + ('common.is.not-accept' | translate)}}</mat-error>
        <mat-error *ngIf="getRequiredErr()">{{('common.error.required' | translate)}}</mat-error>
        <mat-error *ngIf="widthError">{{('common.error.image.width' | translate)}}</mat-error>
        <mat-error *ngIf="heightError">{{('common.error.image.height' | translate)}}</mat-error>
        <mat-error *ngIf="isSquareError">{{('common.error.image.square' | translate)}}</mat-error>
        <mat-error *ngIf="isRectangleError">{{('common.error.image.rectangle' | translate)}}</mat-error>
      </div>
    </div>
  `,
  // styleUrls: ['../../styles/ns-style/ns-multi-upload.scss'],
  providers:
    [
      // {
      //   provide: NG_VALUE_ACCESSOR,
      //   useExisting: forwardRef(() => NsUploadFileComponent),
      //   multi: true,
      // },
    ],
})

export class NsUploadFileComponent implements ControlValueAccessor, OnInit {

  constructor(private http: HttpClient,
              private injector: Injector,
              private fileSaverService: FileSaverService,
              @Self() @Optional() private ngControl: NgControl,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  @ViewChild('fileUpload', {static: false}) fileUpload?: ElementRef<any>;
  @Input() files: UploadModel[] = [];

  @Input() maxSize: number | null = null;
  @Input() height: number | null = null;
  @Input() width: number | null = null;
  @Input() isSquareImg = false;
  @Input() isRectangleImg = false;
  @Input() accept: string[] | null = null;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  /* percent label outside css */
  @Input() percentOfLabelOutside = 25;

  @Output() onFileChange = new EventEmitter();
  @Output() onFileDelete = new EventEmitter<DeleteFileEventModel>();
  sizeError: string | null = null;
  widthError = false;
  heightError = false;
  isSquareError = false;
  isRectangleError = false;
  typeError: string | null = null;
  fileType = '';
  fileName = '';
  imgRef: HTMLImageElement | null = null;
  default$?: string;

  @Input() set value(value: any) {
    this.writeValue(value)
  }

  formControl: AbstractControl | null | undefined;

  @Input() set defaultUrl(fileInfo: { url: string, name: string, type: string }) {
    // if (!fileInfo.url) {
    //   return;
    // ` // }`
    this.default$ = fileInfo.url;
    this.fileType = fileInfo.type;
    this.fileName = fileInfo.name;
    if (1 === 1) {
      return;
    }
    const oReq = new XMLHttpRequest();
    oReq.open('GET', fileInfo.url, true);
    oReq.responseType = 'arraybuffer';

    oReq.onload = (event: any) => {
      const arrayBuffer = oReq.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        // Create a blob from the response
        const blob = new Blob([arrayBuffer]);
        // onload needed since Google Chrome doesn't support addEventListener for FileReader
        const fileReader = new FileReader();
        // console.log('reader', file);
        const file = new File([blob], fileInfo.name, {type: fileInfo.type});
        fileReader.onload = (event: any) => {

          this.writeValue(new UploadModel(fileInfo.name, file, (event.target as FileReader).result));
          console.log('filetype', file.type);


        };
        // Load blob as Data URL
        fileReader.readAsDataURL(file);
      }
    };

    oReq.send(null);

    // this.http.get<Blob>(url).subscribe((value: Blob) => {
    //   const b: any = value;
    //   value.arrayBuffer().then((arr) =>{
    //     b.lastModifiedDate = new Date();
    //     b.name = this.fileName;
    //     const f = new File([value], this.fileName);
    //     this.writeValue(new UploadModel(this.fileName, b, arr));
    //   });
    //
    // });
  }

  ngOnInit() {
    this.callValidator();
  }

  callValidator() {
    const ngControl = this.injector.get(NgControl);
    if (ngControl && !this.formControl) {
      if (ngControl) {
        this.formControl = ngControl.control;
      } else {
        this.formControl = new FormControl();
      }
    }

    if (this.formControl) {
      if (this.required && !this.files.length) {
        this.formControl.setErrors({required: true});
      }
      this.formControl.markAllAsTouched();
    }
  }

  isImageType() {
    return this.fileType.startsWith('image');
  }

  getSrcImg(): any {
    const src = this.isImageType() ? ((this.files[0]) ? this.files[0].previewValue : this.default$) : '';

    return src;
  }

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  writeValue(obj: any): void {
    if (!obj) {
      return;
    }
    if (typeof obj === 'string') {

      const obj1: any = {name: this.fileName, binary: null, previewValue: obj};
      this.files = [obj1]
    } else if (typeof obj === 'object') {
      if (obj.binary === null || obj.binary === undefined) {
        const obj1: any = {id: obj.id, name: obj.name, binary: null, previewValue: obj.url};
        this.files = [obj1]
        this.fileName = obj.name
        this.fileType = obj.type ? obj.type : '';
      } else {
        this.fileName = obj.name;
        this.files = [obj];
      }
    }
    // console.log('write value1', obj, this.files)


    this.propagateChange(this.files);
    this.callValidator();
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
        // console.log('reader', file);
        reader.onload = (event: any) => {

          this.writeValue(new UploadModel(file.name, file, (event.target as FileReader).result));
          console.log('filetype', file.type);
          this.fileType = file.type;
        };
        reader.readAsDataURL(file);

        break;

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
    if (target && target.files) {
      this.onFileChange.emit(event);
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

  removeFiles(event: any, control?: any) {
    if (event) {
      event.stopPropagation();
    }
    this.fileName = '';
    this.fileType = '';
    let deleteFile: UploadModel | undefined;
    if (this.files && this.files.length > 0) {
      deleteFile = this.files[0];
      this.files.splice(0, 1);
      this.propagateChange(this.files);
    }
    (this.fileUpload?.nativeElement as any).value = '';
    this.onFileDelete.emit({ngControl: this.ngControl, file: deleteFile});
  }

  // removeFile(event: any, fileUpload: any, index: number) {
  //   event.stopPropagation();
  //   // fileUpload.value = '';
  //   this.fileName = '';
  //   this.fileType = '';
  //   if (this.files && this.files.length > index) {
  //     this.files.splice(index, 1);
  //     this.propagateChange(this.files);
  //     this.onFileDelete.emit();
  //   }
  //
  // }
  onLoad(img: HTMLImageElement, event: any) {
    if (this.isSquareImg && img.height && img.width &&
      (((img.height / img.width) > 1.1) || ((img.height / img.width) < 1 / 1.1))) {
      this.removeFiles(undefined);
      this.isSquareError = true;
      return;
    } else {
      this.isSquareError = false;
    }
    if (this.isRectangleImg && img.height && img.width &&
      (((img.width / img.height) > 2.2) || ((img.width / img.height) < 2))) {
      this.removeFiles(undefined);
      this.isRectangleError = true;
      return;
    } else {
      this.isRectangleError = false;
    }
    if (this.width && img.width !== this.width) {
      this.removeFiles(undefined);
      this.widthError = true;
      return;
    } else {
      this.widthError = false;
    }
    if (this.height && img.height !== this.height) {
      this.removeFiles(undefined);
      this.heightError = true;
      return;
    } else {
      this.heightError = false;
    }
    const parentElement = img.closest('.preview-image') as HTMLElement;
    parentElement.setAttribute('style', 'background-image:url("' + img.src + '")');
  }

  previewFiles(event: any, downloadId: any) {
    event.stopPropagation();

    downloadId.click();
  }

  downloadFile() {
    const file = this.files[0] as UploadModel;
    if (!file) {
      return;
    }
    if (file.id) {

      // copy apiService.saveFile()
      this.http.post(file.previewValue + '', null, {
        headers: undefined,
        params: undefined,
        observe: 'response',
        responseType: 'blob',
      }).subscribe((l: HttpResponse<Blob>) => {
        let filename = '';
        const disposition = l.headers.get('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        const blobData: Blob | null = l.body;
        const contentType: string | null = l.headers.get('Content-Type');
        if (blobData && contentType) {
          this.fileSaverService.save(blobData, filename, contentType);
        }
      });
    } else {
      if (file.binary) {
        this.fileSaverService.save(file.binary, file.name);
      }
    }
  }

  getRequiredErr() {
    return !this.files.length && this.required && !this.heightError && !this.widthError && !this.isSquareError
      && !this.isRectangleError && !this.typeError && !this.sizeError
  }
}
