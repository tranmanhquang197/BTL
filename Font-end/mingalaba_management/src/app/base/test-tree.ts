import { Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectModel, SuperEntity, TreeFields, UtilsService } from '@next-solutions/next-solutions-base';

@Component({
  selector: 'test-tree',
  template: `
    <div class="box-search">
      <ns-multi-select-autocomplete [multiple]="!isHidingTree" [placeholder]="placeholder|translate"
                                    [options]="autocompleteData" style="width: 100%"
                                    [formControl]="autocompleteControl" [disabled]="disabled"
                                    (selectionChange)="onSelectChange()"
                                    [isTree]="true" [treeSymbol]="symbol">
      </ns-multi-select-autocomplete>
      <div class="expand_collapse" [ngClass]="{'example-tree-invisible': isHidingTree}">
        <button mat-icon-button color="warn" (click)="treeControl.collapseAll()"
                matTooltip="{{'common.tree.collapseAll'|translate}}">
          <mat-icon>unfold_less</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="treeControl.expandAll()"
                matTooltip="{{'common.tree.expandAll'|translate}}">
          <mat-icon>unfold_more</mat-icon>
        </button>
      </div>
    </div>
    <div class="parent-mat-tree" *ngIf="!isHidingTree">
      <mat-tree [dataSource]="dataSource" [treeControl]="treeControl" class="example-tree">
        <!-- This is the tree node template for leaf nodes -->
        <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle
                       [ngClass]="{'example-tree-invisible': !isShowLeafNextTo && !isShowNodeRecursive([node]),
                                'mat-tree-node': isShowNodeRecursive([node])}">
          <li fxLayoutAlign="space-between center" fxLayout>
            <div class="mat-tree-node">
              <!-- use a disabled button to provide padding for tree leaf -->
              <button mat-icon-button disabled></button>
              <label [ngClass]="{'item-focused': isMatchFilterInputValue(node)}">
                {{_treeFields.display(node)}}</label>
            </div>
            <div class="mat-tree-node-button">
              <button mat-icon-button color="warn" (click)="onChooseNode(node)"
                      *ngIf="isShowButtonChoose(node)"
                      matTooltip="{{'common.tree.add'|translate}}">
                <mat-icon>add</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="onRemoveNode(node)"
                      *ngIf="isShowButtonRemove(node)"
                      matTooltip="{{'common.tree.remove'|translate}}">
                <mat-icon>clear</mat-icon>
              </button>
            </div>
          </li>
        </mat-tree-node>
        <!-- This is the tree node template for expandable nodes -->
        <mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild"
                              [ngClass]="{'example-tree-invisible': !isShowNodeRecursive([node])}">
          <li>
            <div class="mat-tree-node">
              <button mat-icon-button matTreeNodeToggle
                      [attr.aria-label]="'toggle ' + _treeFields.value(node)">
                <mat-icon class="mat-icon-rtl-mirror">
                  {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
                </mat-icon>
              </button>
              <label [ngClass]="{'item-focused': isMatchFilterInputValue(node)}">
                {{_treeFields.display(node)}}</label>
            </div>
            <ul *ngIf="treeControl.isExpanded(node)">
              <ng-container matTreeNodeOutlet></ng-container>
            </ul>
          </li>
        </mat-nested-tree-node>
      </mat-tree>
    </div>
  `,
  // encapsulation: ViewEncapsulation.None,
  styles: [`
    .example-tree-invisible {
      display: none;
    }

    .example-tree ul,
    .example-tree li {
      margin-top: 0;
      margin-bottom: 0;
      list-style-type: none;
      height: 100%;
      width: 100%;
      width: -moz-available; /* WebKit-based browsers will ignore this. */
      width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
      width: fill-available;
    }

    .parent-mat-tree {
      min-height: calc(100% - 53px);
      max-height: calc(100% - 53px);
      overflow: auto;
      transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
      margin: 1px;
      border-radius: 2px;
    }

    .parent-mat-tree mat-tree {
      height: 100%;
    }

    .parent-mat-tree mat-tree mat-nested-tree-node {
      height: 100%;
    }

    mat-tree mat-nested-tree-node div.mat-tree-node {
      display: flex;
      align-items: center;
      min-height: 36px;
      height: 36px;
      flex: 1;
      word-wrap: break-word;
    }

    mat-tree mat-nested-tree-node ul mat-tree-node.mat-tree-node {
      display: flex;
      align-items: center;
      min-height: 36px;
      height: 36px;
      flex: 1;
      word-wrap: break-word;
    }

    .box-search {
      margin: 1px;
      border-radius: 2px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
      transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
    }

    .box-search .expand_collapse button {
      padding-top: 6px;
    }

    .box-search ns-multi-select-autocomplete {
      flex: 1;
      border: none;
      outline: none;
      padding-left: 1rem;
    }

    label.item-focused {
      font-weight: bold;
      color: #ff9800;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestTree),
      multi: true,
    },
  ],
})
export class TestTree implements ControlValueAccessor {

  _treeFields: TreeFields = new TreeFields();
  autocompleteData: SelectModel[] = [];

  @Input() set treeData(treeFields: TreeFields) {
    if (treeFields && treeFields.rootData && treeFields.rootData.length > 0) {
      this._treeFields = treeFields;
      this.autocompleteData = UtilsService.convertTreeDataToAutocompleteData(this._treeFields, this.symbol, this.hasChild,
        this._treeFields.rootData, null, null);
      this.onSelectChange();
    }
  }

  @Input() placeholder: string = '';
  @Input() symbol: string = ' >> ';
  @Input() isShowLeafNextTo: boolean = false;
  @Input() disabled: boolean = false;
  @Input() isHidingTree: boolean = false;
  @Output() selectionChange = new EventEmitter();

  treeControl = new NestedTreeControl<any>(node => {
    return this._treeFields && this._treeFields.children ? this._treeFields.children(node) : [];
  });
  dataSource = new MatTreeNestedDataSource<SuperEntity>();
  autocompleteControl = new FormControl();

  constructor() {
  }

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  writeValue(obj: any[]): void {
    if (this._treeFields) {
      this.dataSource.data = this._treeFields.rootData;
      this.treeControl.dataNodes = this._treeFields.rootData;
      if (obj) {
        this.updateTreeChecked(this._treeFields.rootData, obj);
        this.autocompleteControl.setValue(obj);
        this.propagateChange(obj);
        this.selectionChange.emit(obj);
      }
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
    /*NON-EMPTY FOR COMPILE*/
  }

  hasChild = (_: number, node: any): boolean => {
    if (this._treeFields && this._treeFields.children) {
      const children = this._treeFields.children(node);
      return children && children.length > 0;
    }
    return false;
  };

  onSelectChange() {
    const selectedValues = this.autocompleteControl.value as string[];
    this.writeValue(selectedValues);
    if (selectedValues && selectedValues.length > 0) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  updateTreeChecked(nodes: SuperEntity[], selectedValues: string[]) {
    if (this._treeFields) {
      for (const node of nodes) {
        if (this.hasChild(0, node)) {
          this.updateTreeChecked(this._treeFields.children(node), selectedValues);
        } else {
          node.checked = !selectedValues || selectedValues.length === 0; // Nếu selectedValues.length === 0 thì showAll
          if (selectedValues && selectedValues.length > 0) {
            const value = this._treeFields.value(node).toString().toLowerCase();
            if (selectedValues instanceof Array) {
              selectedValues.forEach((selectedValue: string) => {
                node.checked = node.checked || value === selectedValue.toLowerCase();
                if (node.checked) {
                  return;
                }
              });
            } else {
              node.checked = value === (selectedValues as string).toLowerCase();
            }
          }
        }
      }
    }
  }

  isShowNodeRecursive(nodes: SuperEntity[]): boolean {
    let result = false;
    if (this._treeFields) {
      for (const node of nodes) {
        result = result || node.checked
          || (this.hasChild(0, node) && this.isShowNodeRecursive(this._treeFields.children(node)));
        if (result) {
          break;
        }
      }
    }
    return result;
  }

  isMatchFilterInputValue(node: SuperEntity): boolean {
    const selectedValues = this.autocompleteControl.value as string[];
    if (selectedValues && selectedValues.length > 0) {
      return node.checked ? node.checked : false;
    }
    return false;
  }

  isShowButtonChoose(node: SuperEntity): boolean {
    if (this.disabled) {
      return false;
    }
    const selectedValues = this.autocompleteControl.value as string[];
    if (!selectedValues || selectedValues.length <= 0) {
      return false;
    }
    return !node.checked;
  }

  isShowButtonRemove(node: SuperEntity): boolean {
    if (this.disabled) {
      return false;
    }
    const selectedValues = this.autocompleteControl.value as string[];
    if (!selectedValues || selectedValues.length <= 0) {
      return false;
    }
    return node.checked ? node.checked : false;
  }

  onChooseNode(node: SuperEntity) {
    const selectedValues = this.autocompleteControl.value as string[];
    if (selectedValues && selectedValues.length > 0 && this._treeFields) {
      let isExists = false;
      for (const selectedValue of selectedValues) {
        isExists = isExists || selectedValue.toLowerCase() === this._treeFields.value(node).toString().toLowerCase();
      }
      if (!isExists) {
        selectedValues.push(this._treeFields.value(node).toString());
        this.writeValue(selectedValues);
      }
    }
  }

  onRemoveNode(node: SuperEntity) {
    const selectedValues = this.autocompleteControl.value as string[];
    if (selectedValues && selectedValues.length > 0 && this._treeFields) {
      const index = selectedValues.indexOf(this._treeFields.value(node).toString());
      if (index >= 0) {
        selectedValues.splice(index, 1);
        this.writeValue(selectedValues);
      }
    }
  }
}

