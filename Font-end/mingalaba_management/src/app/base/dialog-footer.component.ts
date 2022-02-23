import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {
  AuthoritiesService,
  BaseTableLayout,
  ButtonClickModel,
  ButtonFields,
  UtilsService
} from '@next-solutions/next-solutions-base';

import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-dialog-footer',
  template: `
    <div class="{{footerStyle}}">
      <div>
        <ng-container *ngFor="let button of buttons; let i = index">
          <button mat-button class="{{button.className}}" [style.visibility]="false ? 'hidden': 'visible'"
                  (click)="onClick(button, $event)"
                  [disabled]="button.disabled?button.disabled(null): false"
                  *ngIf="button.display(null)"
          >
            <i class="{{button.icon}}"></i>
            {{button.title | translate}}
          </button>
        </ng-container>
      </div>
    </div>
  `,

})
export class DialogFooterComponent extends BaseTableLayout implements AfterViewInit {
  @Input() buttons?: ButtonFields[];
  @Output() clickAction = new EventEmitter<ButtonClickModel>();
  @Input() footerStyle: any;

  constructor(protected activatedRoute: ActivatedRoute, protected authoritiesService: AuthoritiesService,
              private utilsService: UtilsService) {
    super(activatedRoute, authoritiesService)
  }

  onClick(action: ButtonFields, event: any) {

    const buttonClickModel = new ButtonClickModel(action.click, action);
    this.clickAction.emit(buttonClickModel);

    // const window = this as any;
    // if (window[action.click]) {
    //   console.log('action click', window[action.click])
    //   window[action.click](event);
    // }
    // const buttonClickModel = new ButtonClickModel(action, result);
    // this.clickAction.emit(buttonClickModel);
  }

  ngAfterViewInit(): void {
    if (!this.footerStyle) {
      this.footerStyle = 'dialog_footer center';
    }
    if (this.buttons && this.buttons.length === 0) {
      this.buttons.push(
        {
          columnDef: 'reject',
          color: 'warn',
          icon: 'fa fa-times',
          click: 'onReject',
          header: 'common.action',
          title: 'reject',
          className: 'danger',
          display:e => true,
        },
        {
          columnDef: 'approve',
          color: 'warn',
          icon: 'fa fa-check',
          click: 'onApprove',
          isShowHeader: true,
          title: 'approve',
          className: 'approve',
          display:e => true,
        },
      );
    }
  }


}
