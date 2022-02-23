import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UtilsService} from '@next-solutions/next-solutions-base';


import {TranslateService} from '@ngx-translate/core';
import { mapStyles } from '../../environments/environment';


@Component({
  selector: 'app-base-header',
  template: `
    <div class="dialog_header">
      <div class="dialog_title">
        {{title }}
        <button
          *ngIf="status !== null && status !== undefined && status !== ''" class="{{getMapStyles.STATUS[status]?getMapStyles.STATUS[status].style: ''}}">
          {{getMapStyles.STATUS[this.status]?(getMapStyles.STATUS[this.status].title | translate): ''}}
        </button>
      </div>
      <div class="dialog_title">
        {{closeTitle}}
      <mat-icon class="close-icon" (click)="closeDialog()" *ngIf="showClose">clear</mat-icon>
      </div>
    </div>

  `,


})
export class BaseHeaderComponent {
  @Input() title = '';
  @Input() status?: string;
  @Input() mapStyles: any;
  @Output() doClose = new EventEmitter<string>();
  @Input() showClose? = false;
  @Input() closeTitle?:string;
  @Input() spacebetween = false;
  constructor(
    private utilsService: UtilsService,
    private translateService: TranslateService,
    ) {
  }
  closeDialog() {
    this.doClose.emit()
  }

  get getMapStyles(){
    return mapStyles;
  }

}
