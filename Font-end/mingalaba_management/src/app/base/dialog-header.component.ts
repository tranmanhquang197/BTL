import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '@next-solutions/next-solutions-base';

import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-dialog-header',
  template: `

    <div cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>
<!--      <div class="dialog_title">-->
<!--        {{title }}-->
<!--        <button-->
<!--                *ngIf="status !== null && status !== undefined && status !== ''" class="{{getMapStyles.STATUS[status]?getMapStyles.STATUS[status].style: ''}}">-->
<!--          {{getMapStyles.STATUS[this.status]?(getMapStyles.STATUS[this.status].title | translate): ''}}-->
<!--        </button>-->
<!--      </div>-->
<!--      <mat-icon class="close-icon" (click)="closeDialog()" *ngIf="showClose">clear</mat-icon>-->
<!--    </div>-->
    <app-base-header [title]="title" [mapStyles]="mapStyles" [showClose]="showClose"
                     (doClose)="closeDialog()"></app-base-header>
    </div>

  `,

})
export class DialogHeaderComponent {
  @Input() title = '';
  @Input() mapStyles: any;
  @Output() doClose = new EventEmitter<string>();
  @Input() showClose?= true;
  constructor(
    private utilsService: UtilsService,
    private translateService: TranslateService,
    public dialogRef?: MatDialogRef<any>,) {
  }


  closeDialog() {
    this.utilsService.showConfirmDialog('common.titleCLosePopup', [],
      'common.messageClosePopup', [])
      .afterClosed().subscribe(result => {
        if (result && result.value) {

          if (this.doClose.observers.length > 0) {
            this.doClose.emit(result)
          } else {
            this.dialogRef?.close();
          }

        }
      })
  }


}
