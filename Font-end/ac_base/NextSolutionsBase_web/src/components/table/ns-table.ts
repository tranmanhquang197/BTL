import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MultilanguagePanigator } from './multilanguage.paginator';
import { Paging } from '../../models/Paging';
import { ButtonClickModel } from '../../models/button.click.model';
import { ButtonFields } from '../../models/button.fields';
import { ColumnFields } from '../../models/column.fields';
import { ColumnTypes } from '../../models/enum/column.types';
import { InjectTokenNextSolutionsConfig, NextSolutionsConfig } from '../../modules/next.solutions.config';
import { AlignEnum } from '../../models/enum/align.enum';
import { SuperEntity } from '../../models/SuperEntity';
import { LoaderService } from '../../services/loader.service';
import { TableService } from '../../services/table.service';
import { IconTypeEnum } from '../../models/enum/icon.type.enum';

@Component({
  selector: 'ns-table',
  template: `
      <div class="table-responsive">
          <ng-container *ngIf="!!expandHeaderButton">
              <ns-header-expand-button [moduleName]="moduleName" [expandHeaderButton]="expandHeaderButton"
                                       [columns]="columns">
              </ns-header-expand-button>
          </ng-container>
          <table mat-table #table [dataSource]="results" class="mat-elevation-z8 ns-table">
              <ng-container *ngFor="let column of columns" matColumnDef="{{column.columnDef}}">
                  <ng-container *matHeaderCellDef>
                      <th mat-header-cell [ngClass]="TableService.getColumnHeaderClassName(column)"
                          *ngIf="onDisplayHeaderCell(column)"
                          [ngSwitch]="TableService.getColumnType(column, null)">
                          <div fxLayout="row" *ngSwitchDefault
                               class="viewData"
                               [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                               [fxLayoutAlign]="column.alignHeader ? column.alignHeader : TableService.alignCellContent(column)">
                              {{TableService.displayHeaderName(column, moduleName) | translate}}
                          </div>
                          <mat-checkbox *ngSwitchCase="ColumnTypes.CHECKBOX"
                                        color="primary" class="box-select-all" [(ngModel)]="selectAllChecked"
                                        (change)="toggleSelectAll($event, column)"
                                        [fxLayoutAlign]="column.alignHeader ? column.alignHeader : TableService.alignCellContent(column)">
                          </mat-checkbox>
                      </th>
                  </ng-container>
                  <ng-container *matCellDef="let result;">
                      <td mat-cell [ngClass]="TableService.getColumnClassName(column, result)"
                          *ngIf="onDisplayCell(column, result)"
                          [ngSwitch]="TableService.getColumnType(column, result)">
                          <div title="{{column.title(result)}}" *ngSwitchDefault
                               class="{{TableService.getColumnClassName(column, result)}} viewData"
                               fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)">
                              {{column.cell(result)}}
                          </div>
                          <ng-container *ngSwitchCase="ColumnTypes.BUTTON">
                              <div *ngIf="!!column.button"
                                   class="{{TableService.getColumnClassName(column, result)}}"
                                   fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                                   (click)="$event.stopPropagation()">
                                  <button mat-icon-button color="{{column.button.color}}"
                                          (click)="onClick(column.button.click, result)"
                                          disabled="{{column.button.disabled ? column.button.disabled(result) : false}}"
                                          matTooltip="{{(column.button.title ? column.button.title : '') | translate}}"
                                          class="{{column.button.className}}" [ngSwitch]="TableService.getIconType(column.button)">
                                      <mat-icon *ngSwitchCase="IconTypes.MATERIAL_ICON">{{column.button.icon}}</mat-icon>
                                      <i *ngSwitchCase="IconTypes.FONT_AWESOME" class="{{column.button.icon}}"></i>
                                  </button>
                              </div>
                          </ng-container>
                          <div class="link viewData"
                               [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                               *ngSwitchCase="ColumnTypes.LINK"
                               fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                               title="{{column.title(result)}}">
                            <a [routerLink]="[column.link(result)]" >{{column.cell(result)}}</a>
                          </div>

                        <div class="label-status viewData"
                             [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                             *ngSwitchCase="ColumnTypes.STYLE_CSS"
                             fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                             title="{{column.title(result)}}">
                              <span [style] = "column.style(result)">{{column.cell(result)}}</span>
                        </div>
                        
                          <div class="img-view viewData"
                               [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                               *ngSwitchCase="ColumnTypes.IMG"
                               fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                               title="{{column.title(result)}}">
                              <img [src]="column.cell(result) | secure | async" #imgRef
                                   (error)="TableService.onErrorImgEvent(imgRef, config.NO_IMAGE_AVAILABLE)"/>
                          </div>
                          <div class="img-view viewData"
                               [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                               *ngSwitchCase="ColumnTypes.IMG_NO_SECURE"
                               fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                               title="{{column.title(result)}}">
                              <img [src]="column.cell(result)" #imgRef
                                   (error)="TableService.onErrorImgEvent(imgRef, config.NO_IMAGE_AVAILABLE)"/>
                          </div>
                        <div class="img-view viewData"
                             [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                             *ngSwitchCase="ColumnTypes.IMG_CUSTOMER"
                             fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                             title="{{column.title(result)}}">
                          <img [src]="column.cell(result)"/>
                        </div>
                          <div *ngSwitchCase="ColumnTypes.BASE64"
                               class="img-view viewData"
                               fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                               title="{{column.title(result)}}">
                              <img [src]="'data:image/png;base64,'+column.cell(result)"
                                   #base64ImgRef
                                   (error)="TableService.onErrorImgEvent(base64ImgRef, config.NO_IMAGE_AVAILABLE)"/>
                          </div>
                        <div class="img-view viewData"
                             [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                             *ngSwitchCase="ColumnTypes.IMG_CONTENT"
                             fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                             title="{{column.title(result)}}">
                          <div fxFlex="100%" fxLayout="row">
                            <div fxFlex="40%">
                              <img [src]="column.cell(result)" #imgRef
                                   (error)="TableService.onErrorImgEvent(imgRef, config.NO_IMAGE_AVAILABLE)"/>
                            </div>
                            <div fxFlex="60%">
                              <p>{{column.link(result)}}<p>
                            </div>
                          </div>
                        </div>
                          <ng-container *ngSwitchCase="ColumnTypes.CHECKBOX">
                              <mat-checkbox [(ngModel)]="result[column.columnDef]" color="primary"
                                            *ngIf="column.display ? column.display(result) : true"
                                            [disabled]="column.disabled ? column.disabled(result) : false"
                                            (change)="toggleSelect($event, result, column)"
                                            [fxLayoutAlign]="TableService.alignCellContent(column)">
                              </mat-checkbox>
                          </ng-container>
                      </td>
                  </ng-container>
              </ng-container>

              <ng-container *ngFor="let button of buttons; let i = index" matColumnDef="{{button.columnDef}}">
                  <ng-container *matHeaderCellDef="let header">
                      <!--                    [fxFlex]="(isButtonHeader(button) ? headerButtonWidthDefault : getHeaderButtonWidth(i)) + 'px' "-->
                      <!--                    [fxFlex]="getHeaderButtonWidth(i) + 'px' "-->
                      <th mat-header-cell [ngClass]="button.className"
                          *ngIf="TableService.onDisplayButtonHeaderCell(buttons, button, header, i) && !!buttonColspan"
                          (click)="$event.stopPropagation()"
                          [attr.colspan]="buttonColspan"
                      >
                          <ng-container *ngIf="isButtonHeader(button)">
                              <button mat-icon-button
                                      class="{{button.className}}"
                                      *ngIf="((button.header && button.header.display) ? button.header.display(header) : false) "
                                      [disabled]="(button.header && button.header.disabled) ? button.header.disabled(header) : false"
                                      color="{{button.header.color}}"
                                      (click)="onClick(button.header.click, null)"
                                      matTooltip="{{((button.header && button.header.title) ? button.header.title : '') | translate}}"
                                      [ngSwitch]="TableService.getIconType(button.header)">
                                  <mat-icon *ngSwitchCase="IconTypes.MATERIAL_ICON">{{button.header.icon}}</mat-icon>
                                  <i *ngSwitchCase="IconTypes.FONT_AWESOME" class="{{button.header.icon}}"></i>
                              </button>
                          </ng-container>
                          <ng-container *ngIf="!isButtonHeader(button)">
                              <div title="{{button.header | translate}}"
                                   class="viewData"
                                   fxLayout="row"
                                   fxLayoutAlign="{{button.alignHeader ? button.alignHeader : AlignEnum.LEFT}} center">
                                  {{button.header | translate}}
                              </div>
                          </ng-container>
                      </th>

                  </ng-container>
                  <ng-container *matCellDef="let cell">
                      <!--                     [fxFlex]="headerButtonWidthDefault + 'px'"-->
                      <td mat-cell [ngClass]="button.className"
                          *ngIf="TableService.onDisplayButtonCell(button, cell)"
                          (click)="$event.stopPropagation()">
                          <button mat-icon-button color="{{button.color}}"
                                  (click)="onClick(button.click, cell)"
                                  disabled="{{button.disabled ? button.disabled(cell) : false}}"
                                  matTooltip="{{(button.title ? button.title : '') | translate}}"
                                  class="{{button.className}}" [ngSwitch]="TableService.getIconType(button)">
                              <mat-icon *ngSwitchCase="IconTypes.MATERIAL_ICON">{{button.icon}}</mat-icon>
                              <i *ngSwitchCase="IconTypes.FONT_AWESOME" class="{{button.icon}}"></i>
                          </button>
                      </td>
                  </ng-container>
              </ng-container>


              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let result; columns: displayedColumns; let i = index"
                  [ngClass]="result.className"
                  (click)="onRowClick(result, i)"></tr>
          </table>
          <div *ngIf="!(loaderService.isLoading | async)">
              <div class="paging"
                   *ngIf="hasData()"
                   fxLayout fxLayoutAlign="space-between center">
                  <mat-paginator style-paginator
                                 [showTotalPages]="showTotalPages"
                                 [paging]="varPaging"
                                 (pagingChangeEvent)="getPage($event)"
                                 [length]="varPaging.totalElements"
                                 [pageSize]="varPaging.pageSize"
                                 [pageSizeOptions]="pageSizeOptions"
                                 [pageIndex]="varPaging.pageNumber - 1">
                  </mat-paginator>
                  <div class="go-to-page"
                       fxLayout fxLayoutGap="0.3rem" fxLayoutAlign="start baseline">
                      <mat-label>{{'common.gotopage' | translate}}</mat-label>
                      <ns-counter-input [(ngModel)]="goToPageNumber"
                                        [max]="getTotalPage() ? getTotalPage() : 1"
                                        [min]="1"
                                        [isFloatLabel]="false"
                                        [errorMessages]="errorMsg"
                      ></ns-counter-input>
                      <mat-label style="white-space: nowrap">{{'/' + getTotalPage()}}</mat-label>
                      <button mat-flat-button
                              [disabled]="goToPageNumber < 1 || goToPageNumber > getTotalPage()"
                              (click)="goToPage()">{{ 'common.go' | translate }}
                      </button>
                  </div>
                  <h2 *ngIf="!hasData()">{{ 'common.no.records.found' | translate }}</h2>
              </div>
          </div>
      </div>
  `,
  // styleUrls: ['../../styles/ns-style/ns-table.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: MultilanguagePanigator },
  ],
})
export class NsTable implements OnInit, AfterViewChecked {

  @Input() moduleName: string = '';
  varPaging: Paging;
  @Input() results: MatTableDataSource<SuperEntity> = new MatTableDataSource<SuperEntity>([]);
  @Input() columns: ColumnFields[] = [];
  @Input() buttons: ButtonFields[] = [];
  @Input() showTotalPages: number = 5;
  @Input() expandHeaderButton?: ButtonFields;

  pageSizeOptions: number[];
  @Output() pagingChange = new EventEmitter<Paging>(true);
  @Output() clickAction = new EventEmitter<ButtonClickModel>();
  @Output() onRowClickAction = new EventEmitter<ButtonClickModel>();

  selectAllChecked: boolean = false;
  goToPageNumber: number = 1;
  errorMsg = new Map<string, () => string>()
    .set('min', () => '')
    .set('max', () => '')
    .set('pattern', () => '')
    .set('required', () => '');

  // display status object column in table
  expandDisplayCols = {};

  headerButtonWidthDefault = 50; // px

  buttonColspan = 0;

  constructor(@Inject(InjectTokenNextSolutionsConfig) public config: NextSolutionsConfig,
              /*public domSanitizer: DomSanitizer,*/
              private cdRef: ChangeDetectorRef, public loaderService: LoaderService) {
    this.pageSizeOptions = this.config.PAGE_SIZE_OPTIONS;
    this.varPaging = new Paging();
    this.varPaging.pageSize = this.config.PAGE_SIZE;
    this.varPaging.pageNumber = 1;
    this.varPaging.totalElements = 0;
  }

  @Input() set paging(value: Paging) {
    if (value) {
      this.varPaging = value;
    }
  }

  get displayedColumns(): string[] {
    let columnsDef = this.columns.map(c => c.columnDef);
    if (this.buttons) {
      columnsDef = columnsDef.concat(this.buttons.map(b => b.columnDef));
    }
    // if (!!this.expandHeaderButton) {
    //     columnsDef = columnsDef.concat(this.expandHeaderButton.columnDef);
    // }
    return columnsDef;
  }

  isExpandColumn(col: ColumnFields): boolean {
    return !!col.isExpandOptionColumn ? col.isExpandOptionColumn() : false;
  }

  get ColumnTypes() {
    return ColumnTypes;
  }

  get IconTypes() {
    return IconTypeEnum;
  }

  get AlignEnum() {
    return AlignEnum;
  }

  get TableService() {
    return TableService;
  }

  getPage(pageable: any) {
    this.varPaging.pageNumber = pageable.pageIndex + 1;
    this.varPaging.pageSize = pageable.pageSize;
    this.pagingChange.emit(this.varPaging);
    this.toggleSelect(null, null);
  }

  onClick(action: string, result: any) {
    const buttonClickModel = new ButtonClickModel(action, result);
    this.clickAction.emit(buttonClickModel);
  }

  ngOnInit(): void {
    if (!this.varPaging) {
      this.varPaging = new Paging();
      this.varPaging.pageSize = this.config.PAGE_SIZE;
      this.varPaging.pageNumber = 1;
      this.varPaging.totalElements = 0;
      this.pagingChange.emit(this.varPaging);
    }

    // setup binding object with column
    this.columns.forEach(col => {
      this.expandDisplayCols[col.columnDef] = !(col.isExpandOptionColumn ? col.isExpandOptionColumn() : false);
      col.isExpandOptionColumn = () => !this.expandDisplayCols[col.columnDef];
    });
  }

  onRowClick(result: any, index?: number) {
    const buttonClickModel = new ButtonClickModel('onRowClick', result, index);
    this.onRowClickAction.emit(buttonClickModel);
  }

  onDisplayHeaderCell(column: ColumnFields): boolean {
    return (column.isShowHeader ? column.isShowHeader : !this.hasData()) && !this.isExpandColumn(column);
  }

  onDisplayCell(column: ColumnFields, cell: any): boolean {
    return TableService.onDisplayCell(column, cell) && !this.isExpandColumn(column);
  }


  toggleSelectAll(val: MatCheckboxChange, col: ColumnFields) {
    this.results.data.forEach(v => {
      v.checked = val.checked;
    });
    if (col.onHeaderCellValueChange) {
      col.onHeaderCellValueChange(val.checked);
    }
  }

  toggleSelect(val: MatCheckboxChange | null, result: any, column?: ColumnFields) {
    let count = 0;
    this.results.data.forEach(v => {
      if (v.checked) {
        count++;
      }
    });
    this.selectAllChecked = count === this.results.data.length;
    if (column && column.onCellValueChange) {
      column.onCellValueChange(result);
    }
  }

  ngAfterViewChecked() {
    this.getHeaderButtonColspan();
    this.cdRef.detectChanges();
  }

  hasData(): boolean {
    return this.results && this.results.data && this.results.data.length > 0;
  }

  getTotalPage() {
    if (!this.varPaging) {
      return 0;
    }
    return (this.varPaging.totalElements % this.varPaging.pageSize) === 0
      ? Math.floor(this.varPaging.totalElements / this.varPaging.pageSize)
      : Math.floor((this.varPaging.totalElements / this.varPaging.pageSize) + 1);
  }

  goToPage() {
    if (this.goToPageNumber) {
      this.getPage({ pageIndex: this.goToPageNumber - 1, pageSize: this.varPaging.pageSize });
    }
  }


  getHeaderButtonWidth(index: number) {
    return this.buttons.length * this.headerButtonWidthDefault;
  }

  isButtonHeader(button: ButtonFields) {
    return !!button.header && typeof (button.header) === 'object';
  }

  getHeaderButtonColspan() {
    this.buttonColspan = TableService.getHeaderButtonColspan(this.buttons, this.results.data);
    return this.buttonColspan;
  }
}
