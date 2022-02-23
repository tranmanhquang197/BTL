import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable, of as observableOf } from 'rxjs';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FlatTreeConfigConvertObject } from '../../models/flat.tree.config.model';
import { FlatTreeNode } from '../../models/flat.tree.node.model';
import { FlatTreeService } from './flat.tree.service';
import { NsValidator } from '../../services/ns-validator.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'ns-flat-tree',
  template: `
      <div class="ns-flat-tree labelOutside"
           fxLayout="row" fxLayout.lt-sm="row wrap">
          <mat-label *ngIf="label && !isSearchOutSide" class="label_width"
                     fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
              <div class="label">
                  <div>
                      {{(label ? label : '') | translate}}<span class="required-label-outside">{{!!required ? '*' : ''}}</span>
                  </div>
              </div>
          </mat-label>
          <div class="tree-area"
               fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
              <div fxLayout="row wrap">
                  <div class="choose-area"
                       *ngIf="!checkIsView(isView) && !isCollapseSelected"
                       fxLayout="column" fxFlex="1 1 {{isDisplayChooseTreeOnly ? '100%' : '50%'}}" fxFlex.lt-sm="100%">
                      <div class="header-choose-area">
                          <div class="title-choose-tree" fxLayout="row" fxLayout.lt-sm="row wrap">
                              <mat-label fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%" class="label_width"
                                         *ngIf="label && isSearchOutSide">
                                  <div class="label">{{(label ? label : '') | translate}}<span
                                          class="required-label-outside">{{!!required ? '*' : ''}}</span></div>
                              </mat-label>
                              <mat-divider *ngIf="label && isSearchOutSide"></mat-divider>
                          </div>
                          <mat-form-field appearance="outline"
                                          *ngIf="!isSearchOutSide"
                                          fxLayout="column" fxFlex="auto" fxFlex.lt-md="100%">
                              <input matInput
                                     placeholder="{{'common.searchText'|translate}}"
                                     [(ngModel)]="searchText"
                                     (ngModelChange)="onChangeSearchText()"
                                     autocomplete="off">
                          </mat-form-field>
                      </div>
                      <cdk-virtual-scroll-viewport #chooseAreaScrollViewport itemSize="{{itemSize}}"
                                                   [ngStyle]="{height: viewHeight + 'px'}">
                          <ng-container *cdkVirtualFor="let node of dataSource">
                              <ns-flat-tree-node-left [style.padding-left]="node.level * paddingLeft + 'px'"
                                                      [attr.aria-level]="node.level"
                                                      [treeControl]="treeControl"
                                                      [isHideCheckbox]="isHideCheckbox"
                                                      [node]="node"
                                                      (toggle)="toggleTreeControl(treeControl, node)"
                                                      (onParentNodeClick)="onParentNodeClick(node)"
                                                      (onLeafNodeClick)="onLeafNodeClick(node)"
                                                      (ngModelParentChange)="checkParentNode($event, node)"
                                                      (ngModelLeafChange)="checkLeafNode($event, node)">
                              </ns-flat-tree-node-left>
                          </ng-container>
                      </cdk-virtual-scroll-viewport>
                  </div>
                  <div class="selected-area {{isCollapseSelected ? 'hiddenTree' : ''}}"
                       *ngIf="!isDisplayChooseTreeOnly"
                       fxLayout="column" fxFlex="1 1 {{checkIsView(isView) ? '100%' : '50%'}}" fxFlex.lt-sm="100%">
                      <div class="header-area" *ngIf="!isView">
                          <label>{{selectedLabelTitle | translate}}{{'(' + (value ? value.length : 0) + ')'}}</label>
                          <div class="collapse-expand-all" (click)="toggleSelectedTree()">
                              {{(isCollapseSelected ? 'common.selected.tree.expandAll' : 'common.selected.tree.collapse') | translate}}
                              <i class="fa {{isCollapseSelected ? 'fa-chevron-down' : 'fa-chevron-up'}}"></i>
                          </div>
                      </div>
                      <cdk-virtual-scroll-viewport #selectedScrollViewport
                                                   *ngIf="!isCollapseSelected"
                                                   itemSize="{{itemSize}}" [ngStyle]="{height: viewHeight + 'px'}">
                          <ng-container *cdkVirtualFor="let node of selectedDataSource">
                              <ns-flat-tree-node-right [style.padding-left]="node.level * paddingLeft + 'px'"
                                                       [attr.aria-level]="node.level"
                                                       [treeControl]="selectedTreeControl"
                                                       [node]="node"
                                                       [isView]="isView"
                                                       (toggle)="toggleSelectedTree(node)"
                                                       (deSelectLeafNode)="deSelect(node)"
                                                       (deSelectParentNode)="deSelectParent(node)">
                              </ns-flat-tree-node-right>
                          </ng-container>
                      </cdk-virtual-scroll-viewport>
                  </div>
              </div>
              <mat-hint *ngIf="NsValiator.invalid(formControl)">
                  {{NsValiator.getErrorMessage(formControl, errorMessages) | translate}}
              </mat-hint>
          </div>
      </div>
  `,
})
export class NsFlatTreeComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges {

  @Input() label: string = '';
  @Input() required = false;
  @Input() value: any[] = [];
  valueObjRef: Map<any, FlatTreeNode> = new Map<any, FlatTreeNode>();
  @Input() multiple: boolean = true;
  @Input() disabled: boolean | undefined;
  @Input() isView: (() => boolean) | boolean = false;
  @Input() isDisplayChooseTreeOnly: boolean = false;
  @Input() isHideCheckbox: boolean = false;
  @Input() isCollapseSelected: boolean = false;
  @Input() selectedLabelTitle: string = 'common.selected.tree.label';

  /** height of tree view */
  @Input() viewHeight: number = 300; // px

  /** height of node view */
  @Input() itemSize: number = 48; // px
  paddingLeft: number = 20; //px

  /* percent label outside css */
  @Input() percentOfLabelOutside: number = 25;
  @Input() treeConfig?: FlatTreeConfigConvertObject;
  @Input() isSearchOutSide: boolean = false;
  @Input() searchTextOutSide: string = '';

  searchText = '';

  @Input() errorMessages = new Map<string, (e?: any) => string>();
  @Input() fullDatasource: FlatTreeNode[] = [];
  filterDatasource: FlatTreeNode[] = [];
  treeControl: FlatTreeControl<FlatTreeNode>;
  treeFlattener: MatTreeFlattener<FlatTreeNode, FlatTreeNode>;
  dataSource: MatTreeFlatDataSource<FlatTreeNode, FlatTreeNode>;

  fullDataTreeControl: FlatTreeControl<FlatTreeNode>;
  fullDataTreeFlattener: MatTreeFlattener<FlatTreeNode, FlatTreeNode>;
  fullDataDataSource: MatTreeFlatDataSource<FlatTreeNode, FlatTreeNode>;

  selectedTreeControl: FlatTreeControl<FlatTreeNode>;
  selectedTreeFlattener: MatTreeFlattener<FlatTreeNode, FlatTreeNode>;
  selectedDataSource: MatTreeFlatDataSource<FlatTreeNode, FlatTreeNode>;
  selectedFullDataSource: FlatTreeNode[] = [];
  selectedFullValues: Map<any, any> = new Map<any, any>();
  @Output() selectionChange = new EventEmitter<any>();

  // Chỉ bằng false khi trong NsSmartTable thôi nhé @@
  @Input() isFormControl = true;

  // Cái này là để gắn khi nó là FormControl trong 1 FormGroup
  formControl: AbstractControl | undefined;

  @ViewChild('chooseAreaScrollViewport', { static: false }) chooseVirtualScroll?: CdkVirtualScrollViewport;
  @ViewChild('selectedScrollViewport', { static: false }) selectedVirtualScroll?: CdkVirtualScrollViewport;

  get NsValiator() {
    return NsValidator;
  }

  constructor(private translateService: TranslateService, private injector: Injector,
              private cdr: ChangeDetectorRef,
              @Self() @Optional() ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }


    this.fullDataTreeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.fullDataTreeControl = new FlatTreeControl<FlatTreeNode>(this._getLevel, this._isExpandable);
    this.fullDataDataSource = new MatTreeFlatDataSource(this.fullDataTreeControl, this.fullDataTreeFlattener);
    this.fullDataDataSource.data = this.fullDatasource;

    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FlatTreeNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.setDataSourceOrigin();

    this.selectedTreeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.selectedTreeControl = new FlatTreeControl<FlatTreeNode>(this._getLevel, this._isExpandable);
    this.selectedDataSource = new MatTreeFlatDataSource(this.selectedTreeControl, this.selectedTreeFlattener);
    this.setSelectedNode();

  }

  setSelectedNode() {
    this.selectedDataSource.data = this.selectedFullDataSource;
    if (this.selectedVirtualScroll) {
      this.selectedVirtualScroll.checkViewportSize();
    }
  }

  setDataSourceOrigin() {
    this.fullDataDataSource.data = this.fullDatasource;
    this.dataSource.data = this.filterDatasource;
    if (this.chooseVirtualScroll) {
      this.chooseVirtualScroll.checkViewportSize();
    }
  }

  ngOnInit() {
    this.callValidator();
  }

  ngAfterViewInit() {
    // this.onChangeSearchText();
  }

  getDisplayInputFunc(node: FlatTreeNode): boolean {
    return typeof (node._displayFuncInput) === 'function' ? node._displayFuncInput(node) : !!node._displayFuncInput;
  }

  getDisabledInputFunc(node: FlatTreeNode): boolean {
    return typeof (node._disabledFuncInput) === 'function' ? node._disabledFuncInput(node) : !!node._disabledFuncInput;
  }

  checkDisabledNode(node: FlatTreeNode) {
    return !!node.disabled || this.getDisabledInputFunc(node);
  }

  callValidator() {
    const ngControl = this.injector.get(NgControl);
    if (ngControl && !this.formControl) {
      // Nếu là NsSmartTable thì phải tự new FormControl còn không thì cứ hóng parent FormControl về ^^
      if (this.isFormControl) {
        this.formControl = ngControl.control ? ngControl.control : undefined;
        if (!this.formControl?.value) {
          this.formControl?.setValue(this.value);
        }
      } else {
        this.formControl = new FormControl();
      }
      if (this.formControl) {
        // this.formControl.setValidators(NsValidator.generateNsMultiSelectValidators({
        //   required: this.required,
        // }));
      }
    }
    if (this.formControl) {
      // Nếu this.formControl thuộc NsSmartTable thì setValue lại
      if (!this.isFormControl) {
        this.formControl.setValue(this.value);
      }
      this.formControl.updateValueAndValidity();

      const errorsObj = {};

      const errors = this.formControl.errors;
      if (errors) {
        Object.keys(errors).forEach(key => {
          errorsObj[key] = errors[key];
        });
      }

      if (this.checkRequired(this.required)) {
        if (Array.isArray(this.value) && this.value.length === 0) {
          errorsObj['required'] = true;
        }
      }

      if (Object.keys(errorsObj).length > 0) {
        this.formControl.setErrors(errorsObj);
      } else {
        this.formControl.setErrors(null);
      }
      this.formControl.markAllAsTouched();
    }
  }

  checkRequired(isRequired: boolean | (() => boolean)) {
    return isRequired ? typeof (isRequired) === 'boolean' ? isRequired : isRequired() : false;
  }

  checkIsView(isView: boolean | (() => boolean)) {
    return isView ? typeof (isView) === 'boolean' ? isView : isView() : false;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if ('fullDatasource' in simpleChanges) {
      // this.fullDatasource = simpleChanges.fullDatasource.currentValue;
      if (!this.treeConfig) {
        this.treeConfig = new FlatTreeConfigConvertObject();
      }
      const currentSource = simpleChanges.fullDatasource.currentValue ? simpleChanges.fullDatasource.currentValue : [];
      this.fullDatasource = FlatTreeService.convertTreeToFlatTree(currentSource, this.treeConfig);
      this.filterDatasource = this.fullDatasource;
      this.setDataSourceOrigin();
    }

    if ('treeConfig' in simpleChanges) {
      this.treeConfig = simpleChanges.treeConfig.currentValue;
      if (this.treeConfig) {
        this.fullDatasource = FlatTreeService.convertTreeToFlatTree(this.fullDatasource, this.treeConfig);
        this.filterDatasource = this.fullDatasource;
        this.setDataSourceOrigin();
      }
    }

    if ('multiple' in simpleChanges) {
      this.multiple = simpleChanges.multiple.currentValue;
      if (!this.multiple) {
        this.isHideCheckbox = true;
      }
    }
    if ('disabled' in simpleChanges) {
      this.disabled = simpleChanges.disabled.currentValue;
      if (this.disabled !== undefined && this.disabled !== null) {
        if (!this.treeConfig) {
          this.treeConfig = new FlatTreeConfigConvertObject();
        }
        this.treeConfig.disabled = this.disabled;
        this.fullDatasource = FlatTreeService.convertTreeToFlatTree(this.fullDatasource, this.treeConfig);
        this.filterDatasource = this.fullDatasource;
        this.setDataSourceOrigin();
      }
    }

    if ('searchTextOutSide' in simpleChanges) {
      this.searchText = simpleChanges.searchTextOutSide.currentValue ? simpleChanges.searchTextOutSide.currentValue : '';
      this.onChangeSearchText();
    }

    if (this.value) {
      this.writeValue(this.value);
    }
  }

  transformer = (node: FlatTreeNode, level: number) => {
    node.expandable = FlatTreeService.hasChild(node);
    node.level = level;
    node.checked = !!node.checked;
    return node;
  };

  private _getLevel = (node: FlatTreeNode) => node.level;

  private _isExpandable = (node: FlatTreeNode) => FlatTreeService.hasChild(node);

  private _getChildren = (node: FlatTreeNode): Observable<FlatTreeNode[]> => observableOf(node.children ? node.children : []);

  propagateChange = (_: any) => {
    /*NON-EMPTY FOR COMPILE*/
  };

  registerOnChange(fn: any): void {
    this.propagateChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.propagateChange(fn);
  }

  writeValue(obj: any): void {
    // if (this.multiple && !obj) {
    //   obj = [];
    // }
    if (obj) {
      // if (this.multiple) {
      this.value = obj;
      // }
      this.checkedDefaultValue();
      this.updateSelectAll();
      this.updateSelectedTree();
      this.propagateChange(this.value);
      this.callValidator();
      if (this.isView) {
        this.selectedTreeControl.expandAll();
      }
      this.selectionChange.emit(Array.from(this.valueObjRef.values()));
    }
  }

  updateSelectedTree() {
    this.selectedFullDataSource = [];
    this.getCheckedSelectedTreeDataSource(this.fullDataDataSource.data, this.selectedFullDataSource);
    this.setSelectedNode();
    this.expandTreeDataSource(this.selectedTreeControl, 'isExpanded');
  }

  checkedDefaultValue() {
    let allChildNode;
    for (const rootNode of this.fullDataDataSource.data) {
      if (!FlatTreeService.hasChild(rootNode)) {
        if (this.value.includes(rootNode.value)) {
          rootNode.checked = true;
          if (!this.valueObjRef.has(rootNode.value)) {
            this.valueObjRef.set(rootNode.value, rootNode);
          }
          this.selectedTreeChange(rootNode);
        } else {
          rootNode.checked = false;
          if (this.valueObjRef.has(rootNode.value)) {
            this.valueObjRef.delete(rootNode.value);
          }
          this.selectedTreeChange(rootNode);
        }
        continue;
      }
      allChildNode = this.getAllChildNode(this.fullDataTreeControl, rootNode);
      allChildNode.forEach(childNode => {
        if (!FlatTreeService.hasChild(childNode)) {
          childNode.checked = this.value.includes(childNode.value);
          if (!this.valueObjRef.has(childNode.value) && childNode.checked) {
            this.valueObjRef.set(childNode.value, childNode);
          } else if (this.valueObjRef.has(childNode.value) && !childNode.checked) {
            this.valueObjRef.delete(childNode.value);
          }
          this.selectedTreeChange(childNode);
        }
      });
    }
  }

  getAllChildNode(treeControl: FlatTreeControl<FlatTreeNode>, node: FlatTreeNode) {
    const index = treeControl.dataNodes.findIndex(n => node.value === n.value);
    let sameLevelNextIndex = -1;
    for (let i = index + 1; i < treeControl.dataNodes.length; i++) {
      if (node.level >= treeControl.dataNodes[i].level) {
        sameLevelNextIndex = i;
        break;
      }
    }
    return treeControl.dataNodes.slice(index + 1, sameLevelNextIndex < 0 ? treeControl.dataNodes.length : sameLevelNextIndex);
  }

  updateSelectAll(childrenNode?: FlatTreeNode[]) {
    const data = childrenNode ? childrenNode : this.dataSource.data;
    data.forEach(node => {
      if (FlatTreeService.hasChild(node)) {
        this.updateSelectAll(node.children);
        node.checked = !!node.children && node.children.reduce((checkAll: boolean, curChildNode: FlatTreeNode) => {
          return checkAll && !!curChildNode.checked;
        }, true);
      }
    });
  }

  checkParentNode(checked: boolean, node: FlatTreeNode, isSelectedChange?: boolean) {
    node.checked = checked;
    let indexLeaf = -1;
    // update origin node
    let orgNodeIndex = this.fullDataTreeControl.dataNodes.findIndex(n => n.value === node.value);
    /*this.getNodeInFullDataSource(child)*/
    this.fullDataTreeControl.dataNodes[orgNodeIndex].checked = checked;
    if (orgNodeIndex > -1 && !checked) {
      this.fullDataTreeControl.dataNodes[orgNodeIndex].isExpanded = false;
    }
    const allChild = this.getAllChildNode(this.fullDataTreeControl, node);/*this.treeControl.getDescendants(node);*/
    allChild.reverse();
    allChild.forEach(child => {
      if (!FlatTreeService.hasChild(child)) {
        indexLeaf = this.value.indexOf(child.value);
        if (checked) {
          if (indexLeaf < 0 && !child.disabled && child.display) {
            child.checked = checked;
            this.value.push(child.value);
            this.valueObjRef.set(child.value, child);
          }
        } else {
          if ((indexLeaf >= 0 && !child.disabled && child.display) || !!isSelectedChange) {
            child.checked = checked;
            this.value.splice(indexLeaf, 1);
            this.valueObjRef.delete(child.value);
          }
        }
      } else {
        orgNodeIndex = this.fullDataTreeControl.dataNodes.findIndex(n => n.value === child.value);
        if (orgNodeIndex > -1) {
          this.fullDataTreeControl.dataNodes[orgNodeIndex].isExpanded = false;
          this.fullDataTreeControl.dataNodes[orgNodeIndex].checked = this.fullDataTreeControl.dataNodes[orgNodeIndex].children?.every(n => n.checked);
        }
      }
    });

    if (Array.isArray(this.value) && this.value.length === 0) {
      this.selectedTreeChange(node);
    }
    this.writeValue(this.value);
    this.cdr.detectChanges();
  }

  selectedTreeChange(node: FlatTreeNode) {
    let checkExistSelected;
    if (node.level < 1) {
      checkExistSelected = this.selectedFullValues.has(node.value);
      if (node.checked) {
        this.selectedFullValues.set(node.value, node.value);
      } else if (!node.checked && checkExistSelected) {
        this.selectedFullValues.delete(node.value);
      }
      if (node.checked) {
        this.selectedTreeControl.expandDescendants(node);
      }
    } else {
      const rootNode = this.getRootNode(node);
      if (rootNode) {
        checkExistSelected = this.selectedFullValues.has(rootNode.value);
        if (node.checked) {
          this.selectedFullValues.set(rootNode.value, rootNode.value);
        } else if (!node.checked && checkExistSelected) {
          if (!this.getAllChildNode(this.fullDataTreeControl, rootNode)/*this.treeControl.getDescendants(rootNode)*/.some(child => child.checked)) {
            this.selectedFullValues.delete(node.value);
          }
        }
        if (rootNode.checked) {
          this.selectedTreeControl.expandDescendants(rootNode);
        }
      }
    }
  }

  checkLeafNode(checked: boolean, node: FlatTreeNode, isSelectedChange?: boolean) {
    if ((node.display && !this.checkDisabledNode(node)) || !!isSelectedChange) {
      node.checked = checked;

      // update origin node
      const orgNodeIndex = this.fullDataTreeControl.dataNodes.findIndex(n => n.value === node.value);
      this.fullDataTreeControl.dataNodes[orgNodeIndex].checked = checked;

      if (checked) {
        if (this.multiple) {
          if (!this.value.includes(node.value)) {
            this.value.push(node.value);
            this.valueObjRef.set(node.value, node);
          }
        } else {
          this.value = [node.value];
          this.valueObjRef = new Map<any, FlatTreeNode>().set(node.value, node);
        }

      } else {
        this.value.splice(this.value.indexOf(node.value), 1);
        this.valueObjRef.delete(node.value);
      }
      if (Array.isArray(this.value) && this.value.length === 0) {
        this.selectedTreeChange(node);
      }
      this.writeValue(this.value);
      this.cdr.detectChanges();
    }
  }

  /* Get the parent node of a node */
  getRootNode(node: FlatTreeNode): FlatTreeNode | null {
    const currentLevel = this._getLevel(node);

    if (currentLevel < 1) {
      return node;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this._getLevel(currentNode) < currentLevel) {
        return this.getRootNode(currentNode);
      }
    }
    return node;
  }

  deSelect(node: FlatTreeNode) {
    this.checkLeafNode(false, node, true);
  }

  deSelectParent(node: FlatTreeNode) {
    this.checkParentNode(false, node, true);
  }

  toggleTreeControl(treeControl: FlatTreeControl<FlatTreeNode>, node: FlatTreeNode) {
    treeControl.toggle(node);
    const orgNode = this.fullDataTreeControl.dataNodes.find(n => n.value === node.value);
    if (orgNode) {
      orgNode.isFilterExpanded = treeControl.isExpanded(node);
    }
    if (this.chooseVirtualScroll) {
      this.chooseVirtualScroll.checkViewportSize();
    }
  }

  toggleSelectedTree(node?: FlatTreeNode) {
    if (node) {
      this.selectedTreeControl.toggle(node);
      const orgNode = this.fullDataTreeControl.dataNodes.find(n => n.value === node.value);
      if (orgNode) {
        orgNode.isExpanded = this.selectedTreeControl.isExpanded(node);
      }
      if (this.selectedVirtualScroll) {
        this.selectedVirtualScroll.checkViewportSize();
      }
    } else {
      this.isCollapseSelected = !this.isCollapseSelected;
    }

  }

  onChangeSearchText() {
    this.filterDatasource = [];
    this.getDisplayTreeDataSource(this.fullDataDataSource.data, this.filterDatasource);
    this.setDataSourceOrigin();
    this.expandTreeDataSource(this.treeControl, 'isFilterExpanded');
    if (this.chooseVirtualScroll) {
      this.chooseVirtualScroll.scrollToIndex(0);
    }
  }

  getDisplayTreeDataSource(dataOrigin: FlatTreeNode[], copiedData: FlatTreeNode[]) {
    if (!Array.isArray(dataOrigin)) {
      return [];
    }
    let copiedNode: FlatTreeNode;
    for (const node of dataOrigin) {
      copiedNode = {
        ...node,
        children: [],
      } as FlatTreeNode;
      if (!node.children || !FlatTreeService.hasChild(node)) {
        node.display = node.displayValue.toLowerCase().includes(this.searchText.toLowerCase())
          && this.getDisplayInputFunc(node);
        if (node.display) {
          copiedData.push(node);
        }
      } else {
        this.getDisplayTreeDataSource(node.children, copiedNode.children ? copiedNode.children : []);
        // parent display
        node.display = (node.displayValue.toLowerCase().includes(this.searchText.toLowerCase())
          || node.children?.some(childNode => childNode.display)) && this.getDisplayInputFunc(node);
        node.checked = node.children.filter(child => child.display).length > 0 &&
            node.children.filter(child => child.display).every(childNode => childNode.checked);
        copiedNode.display = node.display;
        copiedNode.checked = node.checked;
        if (node.display) {
          if (!this.getAllChildNode(this.fullDataTreeControl, node).some(childNode => childNode.display)) {
            this.getAllChildNode(this.fullDataTreeControl, node).forEach(childNode => childNode.display = true);
            copiedData.push(node);
          } else {
            copiedData.push(copiedNode);
          }
        }
      }
    }
  }

  getCheckedSelectedTreeDataSource(dataOrigin: FlatTreeNode[], copiedData: FlatTreeNode[]) {
    if (!Array.isArray(dataOrigin)) {
      return [];
    }
    let copiedNode: FlatTreeNode;
    for (const node of dataOrigin) {
      copiedNode = {
        ...node,
        children: [],
      } as FlatTreeNode;
      if (!node.children || (Array.isArray(node.children) && node.children.length === 0)) {
        if (node.checked) {
          copiedData.push(node);
        }
      } else {
        this.getCheckedSelectedTreeDataSource(node.children, copiedNode.children ? copiedNode.children : []);
        // parent checked
        node.checked = this.getAllChildNode(this.fullDataTreeControl, node).every(childNode => childNode.checked);
        node.checkedDisplay = node.checked || this.getAllChildNode(this.fullDataTreeControl, node).some(childNode => childNode.checked);
        copiedNode.checkedDisplay = node.checkedDisplay;

        if (node.checkedDisplay) {
          if (!this.getAllChildNode(this.fullDataTreeControl, node).some(childNode => childNode.checked)) {
            this.getAllChildNode(this.fullDataTreeControl, node).forEach(childNode => childNode.checked = true);
            copiedData.push(node);
          } else {
            copiedData.push(copiedNode);
          }
        }
      }
    }
  }

  expandTreeDataSource(treeControl: FlatTreeControl<FlatTreeNode>, expandProperty: 'isExpanded' | 'isFilterExpanded') {
    treeControl.dataNodes.filter(n => treeControl.isExpandable(n))
      .forEach(child => {
        if (child[expandProperty]) {
          treeControl.expand(child);
        } else {
          treeControl.collapse(child);
        }
      });
  }

  onLeafNodeClick(node: FlatTreeNode) {
    if (this.isHideCheckbox) {
      this.value = [];
      this.valueObjRef.clear();
      this.checkLeafNode(true, node);
    }
  }

  onParentNodeClick(node: FlatTreeNode) {
    if (this.isHideCheckbox) {
      this.value = [];
      this.valueObjRef.clear();
      this.checkParentNode(true, node);
    }
  }
}
