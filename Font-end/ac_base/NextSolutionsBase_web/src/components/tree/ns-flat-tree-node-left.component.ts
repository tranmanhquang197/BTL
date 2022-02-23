import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FlatTreeNode} from "../../models/flat.tree.node.model";
import {FlatTreeControl} from "@angular/cdk/tree";

@Component({
  selector: 'ns-flat-tree-node-left',
  template: `
    <ng-container [ngSwitch]="hasChild(node)">
      <ng-container *ngSwitchCase="false">
        <div class="label-area {{isHideCheckbox ? 'isClickDiv' : ''}}"
             (click)="onLeafNodeClick.emit()"
             fxLayoutAlign="space-between center">
          <button *ngIf="node.level > 0" type="button" mat-icon-button disabled></button>
          {{node.displayValue}}
        </div>
        <mat-checkbox [(ngModel)]="node.checked"
                      [checked]="node.checked"
                      (ngModelChange)="ngModelLeafChange.emit($event)"
                      [disabled]="checkDisabledNode(node)"
                      *ngIf="!isHideCheckbox">
        </mat-checkbox>
      </ng-container>
      <ng-container *ngSwitchCase="true">
        <div class="label-area {{isHideCheckbox ? 'isClickDiv' : ''}}"
             fxLayoutAlign="space-between center">
          <button type="button" mat-icon-button (click)="toggle.emit()"
                  [attr.aria-label]="'toggle ' + node.displayValue">
            <i class="fas {{treeControl?.isExpanded(node) ? 'fa-chevron-up' : 'fa-chevron-down'}}"></i>
          </button>
          <span (click)="onParentNodeClick.emit()">{{node.displayValue}}</span>
        </div>
        <mat-checkbox [(ngModel)]="node.checked"
                      *ngIf="!isHideCheckbox"
                      [checked]="descendantsAllSelected(node)"
                      [disabled]="onDisabledParent(node) || getDisabledInputFunc(node)"
                      [indeterminate]="descendantsPartiallySelected(node)"
                      (ngModelChange)="ngModelParentChange.emit($event)">
        </mat-checkbox>
      </ng-container>
    </ng-container>
  `,
})
export class NsFlatTreeNodeLeftComponent {
  @Input() treeControl: FlatTreeControl<FlatTreeNode> | undefined;
  @Input() isHideCheckbox: boolean = false;
  @Input() node: FlatTreeNode = new FlatTreeNode();
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();
  @Output() onParentNodeClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() onLeafNodeClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() ngModelParentChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() ngModelLeafChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  hasChild = (node: FlatTreeNode) => !!node.children && Array.isArray(node.children) && node.children.length > 0;

  checkDisabledNode(node: FlatTreeNode) {
    return !!node.disabled || this.getDisabledInputFunc(node);
  }

  getDisabledInputFunc(node: FlatTreeNode): boolean {
    return typeof (node._disabledFuncInput) === 'function' ? node._disabledFuncInput(node) : !!node._disabledFuncInput;
  }

  descendantsAllSelected(node: FlatTreeNode): boolean {
    if (this.treeControl) {
      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected = descendants.length > 0 && descendants.every(child => {
        return child.checked;
      });
      return descAllSelected;
    }
    return false;
  }

  descendantsPartiallySelected(node: FlatTreeNode): boolean {
    if (this.treeControl) {
      const descendants = this.treeControl.getDescendants(node);
      const result = descendants.some(child => child.checked);
      return result && !this.descendantsAllSelected(node);
    }
    return false;
  }

  onDisabledParent(parent: FlatTreeNode): boolean {
    if (!parent.disabled) {
      return false;
    } else if (this.treeControl) {
      this.treeControl.getDescendants(parent).forEach(childNode => childNode.disabled = true);
      return true;
    } else {
      return false;
    }
  }

}
