import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {FlatTreeNode} from "../../models/flat.tree.node.model";

@Component({
  selector: 'ns-flat-tree-node-right',
  template: `
    <ng-container [ngSwitch]="hasChild(node)">
      <ng-container *ngSwitchCase="false">
        <div style="width: 100%"
             fxLayout="row"
             fxLayoutAlign="space-between center">
          <div class="label-area"
               fxLayout="row"
               fxLayoutAlign="space-between center">
            <button *ngIf="node.level > 0" type="button" mat-icon-button disabled></button>
            {{node.displayValue}}
          </div>
          <button type="button" mat-icon-button class="danger"
                  *ngIf="!(checkDisabledNode(node) || checkIsView(isView))"
                  (click)="deSelectLeafNode.emit()">
            <i class="far fa-trash-alt"></i>
          </button>
        </div>
      </ng-container>
      <ng-container *ngSwitchCase="true">
        <div style="width: 100%"
             fxLayout="row"
             fxLayoutAlign="space-between center">
          <div class="label-area"
               fxLayout="row"
               fxLayoutAlign="space-between center">
            <button type="button" mat-icon-button (click)="toggle.emit()"
                    [attr.aria-label]="'toggle ' + node.displayValue">
              <i class="fas {{treeControl?.isExpanded(node) ? 'fa-chevron-up' : 'fa-chevron-down'}}"></i>
            </button>
            {{node.displayValue}}
          </div>
          <button type="button" mat-icon-button class="danger"
                  *ngIf="!(checkDisabledNode(node) || checkIsView(isView))"
                  (click)="deSelectParentNode.emit()">
            <i class="far fa-trash-alt"></i>
          </button>
        </div>
      </ng-container>
    </ng-container>
  `,
})
export class NsFlatTreeNodeRightComponent {
  @Input() treeControl: FlatTreeControl<FlatTreeNode> | undefined;
  @Input() node: FlatTreeNode = new FlatTreeNode();
  @Input() isView: (() => boolean) | boolean = false;
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();
  @Output() deSelectLeafNode: EventEmitter<void> = new EventEmitter<void>();
  @Output() deSelectParentNode: EventEmitter<void> = new EventEmitter<void>();

  hasChild = (node: FlatTreeNode) => !!node.children && Array.isArray(node.children) && node.children.length > 0;

  checkDisabledNode(node: FlatTreeNode) {
    return !!node.disabled || this.getDisabledInputFunc(node);
  }

  getDisabledInputFunc(node: FlatTreeNode): boolean {
    return typeof (node._disabledFuncInput) === 'function' ? node._disabledFuncInput(node) : !!node._disabledFuncInput;
  }

  checkIsView(isView: boolean | (() => boolean)) {
    return isView ? typeof (isView) === 'boolean' ? isView : isView() : false;
  }
}
