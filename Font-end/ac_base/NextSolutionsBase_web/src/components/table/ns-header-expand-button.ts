import {Component, Input, OnInit} from '@angular/core';
import {ColumnFields} from "../../models/column.fields";
import {ButtonFields} from "../../models/button.fields";
import {ColumnTypes} from "../../models/enum/column.types";
import {IconTypeEnum} from '../../models/enum/icon.type.enum';
import {TableService} from '../../services/table.service';

@Component({
  selector: 'ns-header-expand-button',
  template: `
    <button mat-icon-button
            class="expand-column-header-button"
            color="{{expandHeaderButton?.color}}"
            [matMenuTriggerFor]="menu"
            matTooltip="{{((expandHeaderButton && expandHeaderButton.title) ? expandHeaderButton.title : '') | translate}}"
    >
      <mat-icon *ngIf="expandHeaderButton && TableService.getIconType(expandHeaderButton)===IconTypes.MATERIAL_ICON">
        {{expandHeaderButton?.icon}}
      </mat-icon>
      <i *ngIf="expandHeaderButton && TableService.getIconType(expandHeaderButton) === IconTypes.FONT_AWESOME"
         class="{{expandHeaderButton?.icon}}"></i>
    </button>


    <mat-menu class="menu-expand-column" #menu="matMenu">
      <div class="header-menu-expand" fxLayout fxLayoutAlign="space-between center">
        <mat-label>{{'common.expand.menu.header.label' | translate}}</mat-label>
        <button mat-flat-button>{{'common.label.done' | translate}}</button>
      </div>
      <div class="choose-area" (click)="$event.stopPropagation()">
        <div mat-menu-item *ngFor="let col of columns">
          <ng-container *ngIf="col.columnType!==ColumnTypes.CHECKBOX">
            <mat-checkbox style="width: 100%"
                          [(ngModel)]="expandDisplayCols[col.columnDef]"
                          [value]="col.columnDef">{{(moduleName + '.table.header.' + col.header) | translate}}</mat-checkbox>

          </ng-container>
        </div>
      </div>
    </mat-menu>

  `,

})
export class NsHeaderExpandButton  implements OnInit{
  @Input() expandHeaderButton?: ButtonFields;
  @Input() columns: ColumnFields[]=[];
  @Input() moduleName = '';
  expandDisplayCols = {};
  constructor() {

  }

  ngOnInit(): void {
    this.columns.forEach(col => {
      this.expandDisplayCols[col.columnDef] = !(col.isExpandOptionColumn ? col.isExpandOptionColumn() : false)
      col.isExpandOptionColumn = () => !this.expandDisplayCols[col.columnDef];
    });
  }

  get ColumnTypes() {
    return ColumnTypes;
  }

  get IconTypes() {
    return IconTypeEnum;
  }


  get TableService() {
    return TableService;
  }

}
