import {Component, Injector, Input, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormArray, FormControl, FormGroup, NgControl} from '@angular/forms';
import {FileTypes} from '@next-solutions/next-solutions-base';


@Component({
  selector: 'ns-multi-upload-file',
  template: `
    <div style="align-items: flex-start" fxLayout="row wrap">
      <ng-container *ngFor="let control of formArray.controls; let i = index" [formGroup]="control">

        <ns-upload-file style="margin-right: 20px"
                        formControlName="imageUrl" (onFileDelete)="onFileDelete({control:control, index:i})"
                        (onFileChange)="onFileChange({control:control, index:i})"
                        [defaultUrl]="{url: null, name: ' ', type: 'image/png'}"
                        [accept]="[FileTypes.PNG, FileTypes.JPG]"
                        [disabled]="disabled"
        ></ns-upload-file>

      </ng-container>

    </div>
  `,
  // styleUrls: ['../../styles/ns-style/ns-multi-upload.scss'],
  providers:
    [
      // {
      //   provide: NG_VALUE_ACCESSOR,
      //   useExisting: forwardRef(() => NsMultiUploadFileComponent),
      //   multi: true,
      // },
    ],
})

export class NsMultiUploadFileComponent implements ControlValueAccessor {
  files: any = [];
  formArray: FormArray = new FormArray([]);
  @Input() isFix = false;
  @Input() maxControls = -1;
  @Input() disabled =false;
  constructor(private injector: Injector,
              @Self() @Optional() private ngControl: NgControl) {
    if (ngControl) {
      // Hành động này thay cho provide: NG_VALUE_ACCESSOR và gắn ControlValueAccessor này vào parent FormControl
      ngControl.valueAccessor = this;
    }
  }

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };


  get FileTypes() {
    return FileTypes;
  }

  writeValue(value: any): void {
    console.log('multiupload, write value', value);
    // this.formArray = new FormArray(
    //   value.map((x: any) => {
    //     return new FormGroup({
    //       imageUrl: new FormControl(x),
    //
    //     });
    //   })
    // );
    this.formArray.clear();
    const remain = this.isFix ? (this.maxControls === -1 ? value.length : this.maxControls)
      : (this.maxControls === -1 ? (value.length + 1) : this.maxControls);

    for (let i = 0; i < remain; i++) {
      const url = i < value.length ? value[i] : '';
      this.formArray.push(new FormGroup({
        imageUrl: new FormControl(url),
      }))
    }

    // this.formArray.controls.forEach(
    //   control => {
    //     control.valueChanges.subscribe(
    //       () => {
    //         console.log(this.formArray.controls.indexOf(control)) // logs index of changed item in form array
    //       }
    //     )
    //   }
    // )
    this.formArray.valueChanges.subscribe(res => {
      // this._onChange(res);
      console.log('file change', res)
      this.propagateChange(res);
    });

  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
    /*NON-EMPTY FOR COMPILE*/
  }

  onFileDelete(event: any) {
    // console.log('remove file', event, this.formArray.controls.indexOf(event), this.formArray.controls.indexOf(event.control))
    if (this.isFix){
      return;
    }
    this.formArray.removeAt(event.index)
    console.log('aaaaaaa', this.formArray.length, this.maxControls)
    if((this.formArray.length + 1)=== this.maxControls ){
      this.formArray.push(new FormGroup({
        imageUrl: new FormControl(''),
      }));
    }
    // this.formArray.controls.forEach(
    //   (control: any, index: number) => {
    //     console.log('controllllllllll', control.controls, event === control.controls[0], event.control === control.controls[0])
    //     if (event.control === control.controls.imageUrl) {
    //       console.log('delete file', control)
    //       this.formArray.removeAt(index)
    //     }
    //   }
    // )


  }

  onFileChange(event: any) {
    console.log('event', event)
    if ((event.index < this.formArray.length - 1) || this.isFix || (event.index === this.maxControls - 1)) {
      return;
    }

    this.formArray.push(new FormGroup({
      imageUrl: new FormControl(''),

    }));
  }
}
