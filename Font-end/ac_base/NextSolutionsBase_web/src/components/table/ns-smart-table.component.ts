import {
    AfterContentChecked,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Injector,
    Input,
    OnChanges,
    OnInit,
    Optional,
    Output,
    Self,
    ViewChild,
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ColumnFields} from '../../models/column.fields';
import {ColumnTypes} from '../../models/enum/column.types';
import {NsValidator} from '../../services/ns-validator.service';
import {ButtonClickModel} from '../../models/button.click.model';
import {SuperEntity} from '../../models/SuperEntity';
import {AlignEnum} from '../../models/enum/align.enum';
import {ButtonFields} from '../../models/button.fields';
import {TableService} from '../../services/table.service';
import {IconTypeEnum} from '../../models/enum/icon.type.enum';
import {FooterFields} from '../../models/footer.fields';
import {InjectTokenNextSolutionsConfig, NextSolutionsConfig} from '../../modules/next.solutions.config';

@Component({
    selector: 'ns-smart-table',
    template: `
        <div class="table-responsive" [ngClass]="{'fixed_header': isSticky||isStickyHeader, 'fixed_footer': isSticky||isStickyFooter}">
            <table mat-table [dataSource]="datasource" #matTable class="mat-elevation-z8 ns-smart-table">
                <ng-container *ngFor="let column of columns" matColumnDef="{{column.columnDef}}">
                    <ng-container *matHeaderCellDef>
                        <th mat-header-cell class="{{TableService.getColumnHeaderClassName(column)}}"
                            *ngIf="onDisplayHeaderCell(column)">
                            <!--                        *ngIf="getColumnType(column, result)!==ColumnTypes.CHECKBOX"-->
                            <div [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                                 fxLayout="row"
                                 [fxLayoutAlign]="column.alignHeader ? column.alignHeader : TableService.alignCellContent(column)">
                                <mat-checkbox
                                        *ngIf="TableService.getColumnType(column, null)===ColumnTypes.CHECKBOX && !column.isNotShowHeaderCheckbox"
                                        color="primary" class="box-select-all margin-right-5" [(ngModel)]="selectAllChecked"
                                        (change)="toggleSelectAll($event, column)">
                                </mat-checkbox>
                                {{TableService.displayHeaderName(column, moduleName) | translate}}<span
                                    style="color: red">{{getRequired(column) ? '*' : ''}}</span>
                            </div>
                        </th>
                    </ng-container>
                    <ng-container *matCellDef="let result;  let i = index">
                        <td mat-cell [ngClass]="TableService.getColumnClassName(column,result)"
                            *ngIf="TableService.onDisplayCell(column, result)"
                            [ngSwitch]="TableService.getColumnType(column, result)">
                            <div title="{{column.title(result)}}"
                                 *ngSwitchCase="ColumnTypes.VIEW"
                                 class="viewData {{TableService.getColumnClassName(column,result)}}"
                                 fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)">
                                {{column.cell(result)}}
                            </div>
                            <div class="link viewData"
                                 [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                                 *ngSwitchCase="ColumnTypes.LINK"
                                 fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                                 title="{{column.title(result)}}">
                                <a [routerLink]="[column.link(result)]">{{column.cell(result)}}</a>
                            </div>
                            <div class="img-view viewData {{TableService.getColumnClassName(column,result)}}"
                                 [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                                 *ngSwitchCase="ColumnTypes.IMG"
                                 fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                                 title="{{column.title(result)}}">
                                <img [src]="column.cell(result) | secure | async"
                                     #imgRef
                                     (error)="TableService.onErrorImgEvent(imgRef, config.NO_IMAGE_AVAILABLE)"/>
                            </div>
                            <div class="img-view viewData {{TableService.getColumnClassName(column,result)}}"
                                 [ngClass]="{'break-word-style-view': !!column.hasWordBreakStyle}"
                                 *ngSwitchCase="ColumnTypes.IMG_NO_SECURE"
                                 fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                                 title="{{column.title(result)}}">
                                <img [src]="column.cell(result)"
                                     #imgRef
                                     (error)="TableService.onErrorImgEvent(imgRef, config.NO_IMAGE_AVAILABLE)"/>
                            </div>
                            <div *ngSwitchCase="ColumnTypes.BASE64"
                                 class="viewData img-view base64 {{TableService.getColumnClassName(column,result)}}"
                                 fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                                 title="{{column.title(result)}}">
                                <img [src]="'data:image/png;base64,'+column.cell(result)"
                                     #base64ImgRef
                                     (error)="TableService.onErrorImgEvent(base64ImgRef, config.NO_IMAGE_AVAILABLE)"/>
                            </div>
                            <ng-container *ngSwitchCase="ColumnTypes.BUTTON">
                                <div *ngIf="!!column.button"
                                     class="{{TableService.getColumnClassName(column, result)}}"
                                     fxLayout="row" [fxLayoutAlign]="TableService.alignCellContent(column)"
                                     (click)="$event.stopPropagation()">
                                    <button mat-icon-button
                                            color="{{column.button.color}}"
                                            [ngClass]="column.button.className"
                                            (click)="onClick(column.button.click, result, i)"
                                            disabled="{{column.button.disabled ? column.button.disabled(result) : false}}"
                                            matTooltip="{{(column.button.title ? column.button.title : '') | translate}}"
                                            [ngSwitch]="TableService.getIconType(column.button)">
                                        <mat-icon *ngSwitchCase="IconTypes.MATERIAL_ICON">{{column.button.icon}}</mat-icon>
                                        <i *ngSwitchCase="IconTypes.FONT_AWESOME" class="{{column.button.icon}}"></i>
                                    </button>
                                </div>
                            </ng-container>
                            <ns-counter-input *ngSwitchCase="ColumnTypes.INPUT_COUNTER"
                                              class="inputNumber" #nsCounterInput
                                              [isFormControl]="false"
                                              [alignNumber]="getCounterImputAlign(column)"
                                              [disabled]="column.disabled ? column.disabled(result) : false"
                                              [value]="result[column.columnDef]"
                                              [required]="getRequired(column)"
                                              [errorMessages]="getErrorMessageMap(column)"
                                              [isDecimal]="getIsDecimal(column)"
                                              [min]="column.min ? column.min(result) : null"
                                              [max]="column.max ? column.max(result) : null"
                                              (onChange)="onCellValueChange(result, column, $event);">
                            </ns-counter-input>
                            <ns-input *ngSwitchCase="ColumnTypes.INPUT"
                                      [isFormControl]="false"
                                      [disabled]="column.disabled ? column.disabled(result) : false"
                                      [text]="result[column.columnDef]"
                                      [required]="getRequired(column)"
                                      [errorMessages]="getErrorMessageMap(column)"
                                      (onChange)="onCellValueChange(result, column, $event);">
                            </ns-input>
                            <ns-date-picker *ngSwitchCase="ColumnTypes.DATE_PICKER"
                                            [value]="result[column.columnDef]"
                                            [isFormControl]="false"
                                            [minDate]="column.min ? column.min(result) : null"
                                            [maxDate]="column.max ? column.max(result) : null"
                                            [required]="getRequired(column)"
                                            [disabled]="column.disabled ? column.disabled(result) : false"
                                            [errorMessages]="getErrorMessageMap(column)"
                                            (onChange)="onCellValueChange(result, column, $event);">
                            </ns-date-picker>
                            <ns-multi-select-autocomplete [isFormControl]="false"
                                                          *ngSwitchCase="ColumnTypes.MULTI_SELECT_AUTOCOMPLETE"
                                                          class="multiSelectAutocomplete"
                                                          [isTree]="!!column.isTree"
                                                          [value]="result[column.columnDef]"
                                                          [errorMessages]="getErrorMessageMap(column)"
                                                          [required]="getRequired(column)"
                                                          [disabled]="column.disabled ? column.disabled(result) : false"
                                                          [multiple]="false" [options]="column.optionValues(result)"
                                                          (selectionChange)="onCellValueChange(result, column, $event);">
                            </ns-multi-select-autocomplete>
                            <div class="checkbox-cell"
                                 fxLayout="row"
                                 [fxLayoutAlign]="TableService.alignCellContent(column)"
                                 *ngSwitchCase="ColumnTypes.CHECKBOX">
                                <mat-checkbox [(ngModel)]="result[column.columnDef]" color="primary"
                                              *ngIf="column.display ? column.display(result) : true"
                                              [disabled]="column.disabled ? column.disabled(result) : false"
                                              (change)="toggleSelect($event,result, column)">
                                </mat-checkbox>
                            </div>
                        </td>
                    </ng-container>
                </ng-container>
                <ng-container *ngFor="let button of buttons; let i = index" matColumnDef="{{button.columnDef}}">
                    <ng-container *matHeaderCellDef="let header">
                        <th mat-header-cell
                            [ngClass]="button.className"
                            *ngIf="TableService.onDisplayButtonHeaderCell(buttons, button, header, i) && !!buttonColspan"
                            (click)="$event.stopPropagation()"
                            [attr.colspan]="buttonColspan">
                            <!--                        [fxFlex]="getHeaderButtonWidth(i) + 'px' "-->
                            <ng-container *ngIf="isButtonHeader(button)">
                                <button mat-icon-button
                                        class="{{button.className}}"
                                        color="{{button.header.color}}"
                                        (click)="onClick(button.header.click, null, null)"
                                        [disabled]="(button.header && button.header.disabled) ? button.header.disabled(header) : false"
                                        *ngIf="(button.header && button.header.display) ? button.header.display(header) : false"
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
                    <ng-container *matCellDef="let cell; let i = index">
                        <td mat-cell [ngClass]="button.className"
                            *ngIf="TableService.onDisplayButtonCell(button, cell)"
                            (click)="$event.stopPropagation()">
                            <button mat-icon-button
                                    color="{{button.color}}"
                                    [ngClass]="button.className"
                                    (click)="onClick(button.click, cell, i)"
                                    disabled="{{button.disabled ? button.disabled(cell) : false}}"
                                    matTooltip="{{(button.title ? button.title : '') | translate}}"
                                    [ngSwitch]="TableService.getIconType(button)">
                                <mat-icon *ngSwitchCase="IconTypes.MATERIAL_ICON">{{button.icon}}</mat-icon>
                                <i *ngSwitchCase="IconTypes.FONT_AWESOME" class="{{button.icon}}"></i>
                            </button>
                        </td>
                    </ng-container>
                </ng-container>
                <ng-container *ngFor="let column of columns">
                    <ng-container *ngFor="let footer of column.footers; let i = index"
                                  matColumnDef="{{i}}-{{column.columnDef}}">
                        <ng-container *matFooterCellDef>
                            <td mat-footer-cell *ngIf="onDisplayFooter(footer, datasource.data)"
                                [attr.colspan]="TableService.getColspan(footer, datasource.data)"
                                class="{{TableService.getColumnClassName(column,datasource.data)}} {{TableService.getColumnClassName(column.footer,datasource.data)}}">
                                <div title="{{footer.title(datasource.data)}}"
                                     class="viewData {{TableService.getColumnClassName(column,datasource.data)}}"
                                     fxLayout="row"
                                     [fxLayoutAlign]="footer.align ? footer.align : AlignEnum.LEFT">
                                    {{footer.cell(datasource.data)}}
                                </div>
                            </td>
                        </ng-container>
                    </ng-container>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: isSticky||isStickyHeader"></tr>
                <tr mat-row *matRowDef="let result; columns: displayedColumns;" class="{{result.className}}"
                    [ngClass]="{'childRow0': !!result.isChildRow && result.parentRowClassIndex === 0,
                                   'parentRow0': !result.isChildRow  && result.parentRowClassIndex === 0,
                                   'childRow1': !!result.isChildRow && result.parentRowClassIndex === 1,
                                   'parentRow1': !result.isChildRow  && result.parentRowClassIndex === 1}"
                ></tr>
                <ng-container *ngFor="let df of displayedFooters">
                    <tr mat-footer-row *matFooterRowDef="df; sticky: isSticky||isStickyFooter"></tr>
                </ng-container>
            </table>
        </div>
    `,
    // styleUrls: ['../../styles/ns-style/ns-smart-table.scss'],
    // providers: [
    //   {
    //     provide: NG_VALUE_ACCESSOR,
    //     useExisting: forwardRef(() => NsSmartTable),
    //     multi: true,
    //   },
    //   {
    //     provide: NG_VALIDATORS,
    //     useExisting: forwardRef(() => NsSmartTable),
    //     multi: true,
    //   },
    // ],
})
export class NsSmartTable implements ControlValueAccessor, OnChanges, OnInit, AfterContentChecked {

    @Input() moduleName: string = '';
    @Input() columns: ColumnFields[] = [];
    @Input() buttons: ButtonFields[] = [];
    @Input() value: any[] = [];
    @Input() minRow: number = 0;
    @Input() maxRow: number = 9999;
    @Input() errorMessages = new Map<string, () => string>();
    @Input() isFormControl: boolean = true;
    @Input() isSticky: boolean = false;
    @Input() isStickyHeader: boolean = false;
    @Input() isStickyFooter: boolean = false;

    @Output() clickAction = new EventEmitter<ButtonClickModel>();
    @Output() onChange = new EventEmitter();

    headerButtonWidthDefault = 50; // px

    @ViewChild('matTable') matTable?: MatTable<any>;
    @Input() isExpandRowTable = false;
    @Input() expandRowProperty: string = '';


    $displayedColumns: string[] = [];
    $displayedFooters: string[][] = [];
    datasource: MatTableDataSource<SuperEntity | any> = new MatTableDataSource<SuperEntity | any>([]);
    formControl: AbstractControl | undefined;
    selectAllChecked: boolean = false;

    buttonColspan = 0;

    get AlignEnum() {
        return AlignEnum;
    }

    get IconTypes() {
        return IconTypeEnum;
    }

    get TableService() {
        return TableService;
    }

    propagateChange = (_: any) => {
        /*NON-EMPTY FOR COMPILE*/
    };

    writeValue(obj: any[] | any): void {
        if (obj) {
            // console.log(obj);
            this.value = obj;
            if (this.isExpandRowTable && this.datasource.data !== this.value) {
                this.datasource = new MatTableDataSource<SuperEntity>(this.value);
                let parentRowIndex = 0;
                for (let i = 0; i < this.datasource.data.length; i++) {
                    const row = this.datasource.data[i];
                    if (!row.isChildRow) {
                        this.expandRow(i, row, parentRowIndex);
                        parentRowIndex = (++parentRowIndex) % 2;
                    }
                }
            } else {
                this.datasource = new MatTableDataSource<SuperEntity>(this.value);
            }
            this.toggleSelect(null);
            // console.log('NsSmartTable - writeValue', this.value);
            this.callValidator();
            this.propagateChange(this.isExpandRowTable ? this.getParentRowData() : this.value);
            this.onChange.emit();
        }
    }

    getParentRowData() {
        return this.value.filter((row: any) => {
            return !row.isChildRow;
        });
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
        /*NON-EMPTY FOR COMPILE*/
    }

    constructor(private ref: ChangeDetectorRef,
                @Inject(InjectTokenNextSolutionsConfig) public config: NextSolutionsConfig,
                private injector: Injector, @Self() @Optional() ngControl: NgControl) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }

    ngOnChanges() {
        this.writeValue(this.value);
    }

    ngOnInit() {
        // console.log('NsSmartTable - ngOnInit');
        this.callValidator();
    }

    ngAfterContentChecked() {
        this.getHeaderButtonColspan();
        this.ref.detectChanges();
    }

    get displayedColumns(): string[] {
        if (!this.$displayedColumns || this.$displayedColumns.length <= 0) {
            this.$displayedColumns = this.columns.map((c: ColumnFields) => c.columnDef);
            if (this.buttons) {
                this.$displayedColumns = this.$displayedColumns.concat(this.buttons.map((b: ButtonFields) => b.columnDef));
            }
        }
        return this.$displayedColumns;
    }

    get displayedFooters(): string[][] {
        if (!this.$displayedFooters || this.$displayedFooters.length <= 0) {
            for (const column of this.columns) {
                if (!!column.footers) {
                    for (let i = 0; i < column.footers.length; i++) {
                        if (!this.$displayedFooters[i]) {
                            this.$displayedFooters[i] = [];
                        }
                        this.$displayedFooters[i] = this.$displayedFooters[i].concat([i + '-' + column.columnDef]);
                    }
                }
            }
        }
        return this.$displayedFooters;
    }

    /*
      Nếu sử dụng expandTableRow khi xử lý sự kiện bên ngoài component không sử dụng index bên trong base, set index lại bằng indexOf
    */
    onClick(action: string, result: any, index: number | null) {
        let buttonClickModel;
        // if (this.isExpandRowTable) {
        //   buttonClickModel = new ButtonClickModel(action, result, undefined);
        // } else {
        buttonClickModel = new ButtonClickModel(action, result, index);
        // }
        this.clickAction.emit(buttonClickModel);
    }

    onCellValueChange(result: any, column: ColumnFields, $event: any) {
        result[column.columnDef] = $event;
        if (column.onCellValueChange) {
            column.onCellValueChange(result);
        }
        this.callValidator();
        this.onChange.emit();
    }

    get ColumnTypes() {
        return ColumnTypes;
    }

    toggleSelectAll(val: MatCheckboxChange, col: ColumnFields) {
        if (this.value) {
            this.value.forEach(v => {
                v.checked = val.checked;
            });
        }
        if (col.onHeaderCellValueChange) {
            col.onHeaderCellValueChange(val.checked);
        }
    }

    toggleSelect(val: MatCheckboxChange | null, result?: any, column?: ColumnFields) {
        let count = 0;
        if (this.value && this.value.length > 0) {
            this.value.forEach(v => {
                if (v.checked) {
                    count++;
                }
            });
            this.selectAllChecked = count === this.value.length;
        } else {
            this.selectAllChecked = false;
        }

        if (column) {
            this.onCellValueChange(result, column, val?.checked);
        }
    }

    onDisplayHeaderCell(column: ColumnFields): boolean {
        return column.isShowHeader ? column.isShowHeader : false;
    }


    onDisplayFooter(footer: FooterFields, dataTable: any[]) {
        return typeof (footer.display) === 'function' ? footer.display(dataTable) : !!footer.display;
    }

    // //Cái khúc này về sau mà có cái loại validate nào mà ngoài thì mới enable validate cột sau
    // validate(control: AbstractControl): ValidationErrors | null {
    //     let valid = null;
    //
    //     if (this.value) {
    //         for (const row of this.value) {
    //             for (const column of this.columns) {
    //                 if (column.validate) {
    //                     valid = column.validate(row);
    //                     if (valid) {
    //                         break;
    //                     }
    //                 }
    //             }
    //             if (valid) {
    //                 break;
    //             }
    //         }
    //     }
    //     return valid;
    // }

    callValidator() {
        const ngControl = this.injector.get(NgControl);
        if (ngControl && !this.formControl) {
            if (this.isFormControl) {
                this.formControl = ngControl.control ? ngControl.control : undefined;
            } else {
                this.formControl = new FormControl();
            }
            if (this.formControl) {
                this.formControl.setValidators(NsValidator.generateNsSmartTableValidators({
                    columns: this.columns,
                    minRow: this.minRow,
                    maxRow: this.maxRow,
                }));
            }
        }
        if (this.formControl) {
            if (!this.isFormControl) {
                this.formControl.setValue(this.value);
            }
            this.formControl.updateValueAndValidity();
        }
    }

    getRequired(column: ColumnFields) {
        return typeof (column.isRequired) === 'function' ? column.isRequired() : column.isRequired;
    }

    getIsDecimal(column: ColumnFields) {
        return column.isDecimal ? typeof (column.isDecimal) === 'boolean' ? column.isDecimal : column.isDecimal() : false;
    }

    getErrorMessageMap(column: ColumnFields) {
        return column.errorMessage ? column.errorMessage : new Map<string, () => string>();
    }

    getHeaderButtonWidth(index: number) {
        return this.buttons.length * this.headerButtonWidthDefault;
    }

    isButtonHeader(button: ButtonFields) {
        return !!button.header && typeof (button.header) === 'object';
    }

    expandRow(i: number, row: any, parentRowClassIndex: number | 0 | 1) {
        // do not add more rows if the click was on a child row
        if (row.isChildRow) {
            return;
        }

        // default not expand
        // if (row.expanded) {
        //   // remove the flag
        //   row.expanded = false;
        //
        //   // remove the child rows
        //   let childrenDetected = false;
        //   const length = this.datasource.data.length;
        //   for (let index = 0; index < length; index++) {
        //     if (childrenDetected && !this.datasource.data[index].isChildRow) {
        //       break;
        //     }
        //
        //     if (index > i && this.datasource.data[index].isChildRow) {
        //       this.datasource.data.splice(index, 1);
        //       index--;
        //       childrenDetected = true;
        //     }
        //   }
        //
        //   this.matTable?.renderRows();
        //   return;
        // }

        // set expanded to true so we don't expand this row again
        row.expanded = true;
        row.parentRowClassIndex = parentRowClassIndex;

        const itemsToAdd: any[] = row[this.expandRowProperty];

        // mark as child rows
        itemsToAdd.forEach(item => {
            item.isChildRow = true;
            item.parentRowClassIndex = parentRowClassIndex;
        });

        // add rows including header row
        itemsToAdd.reverse();
        itemsToAdd.forEach(x => {
            this.datasource.data.splice(i + 1, 0, x);
        });

        // rerender table
        this.matTable?.renderRows();
    }

    getCounterImputAlign(column: ColumnFields) {
        return column.align ? column.align : AlignEnum.RIGHT;
    }

    getHeaderButtonColspan() {
        this.buttonColspan = TableService.getHeaderButtonColspan(this.buttons, this.datasource.data);
        return this.buttonColspan;
    }
}
