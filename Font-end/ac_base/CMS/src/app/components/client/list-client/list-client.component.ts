import {Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpParams} from '@angular/common/http';
import {ClientModel} from '../../../_models/client.model';
import {AddEditClientComponent} from '../add-edit-client/add-edit-client.component';
import {MatDialog} from '@angular/material/dialog';
import {
  AlignEnum,
  ApiService,
  AuthoritiesService,
  BaseSearchLayout,
  ButtonFields,
  ColumnFields,
  FormStateService,
  UtilsService,
  IconTypeEnum
} from '@next-solutions/next-solutions-base';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListClientComponent extends BaseSearchLayout implements OnInit {

  moduleName = 'client';
  columns: ColumnFields[];

  buttons: ButtonFields[];

  constructor(protected router: Router, protected apiService: ApiService, protected utilsService: UtilsService,
              protected formStateService: FormStateService, protected translateService: TranslateService,
              protected injector: Injector, private dialog: MatDialog,
              protected activatedRoute: ActivatedRoute,
              protected authoritiesService: AuthoritiesService,
              private fb: FormBuilder) {
    super(router, apiService, utilsService, formStateService, translateService, injector, activatedRoute, authoritiesService, fb.group({
      text: [''],
    }));
    this.columns = [
      {
        columnDef: 'stt',
        header: 'stt',
        title: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
        cell: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
        className: 'mat-column-stt',
        align: AlignEnum.CENTER
      },
      {
        columnDef: 'clientId',
        header: 'clientId',
        title: (e: ClientModel) => `${e.clientId}`,
        cell: (e: ClientModel) => `${e.clientId}`,
        className: 'mat-column-clientId'
      },
      {
        columnDef: 'scope',
        header: 'scope',
        title: (e: ClientModel) => `${e.scope}`,
        cell: (e: ClientModel) => `${e.scope}`,
        className: 'mat-column-scope'
      },
      {
        columnDef: 'authorities',
        header: 'authorities',
        title: (e: ClientModel) => `${e.authorities}`,
        cell: (e: ClientModel) => `${e.authorities}`,
        className: 'mat-column-authorities'
      },
      {
        columnDef: 'accessTokenValidity',
        header: 'accessTokenValidity',
        title: (e: ClientModel) => `${e.accessTokenValidity}`,
        cell: (e: ClientModel) => `${e.accessTokenValidity}`,
        className: 'mat-column-accessTokenValidity'
      }
    ];

    this.buttons = [
      {
        columnDef: 'addEdit',
        icon: 'fa fa-pen',
        iconType: IconTypeEnum.FONT_AWESOME,
        isShowHeader: true,
        display: (e: ClientModel) => e && true, // Author
        title: 'common.title.edit',
        click: 'addOrEdit',
        className: 'secondary mat-column-edit',
        header: {
          columnDef: 'addEdit',
          icon: 'fa fa-plus',
          iconType: IconTypeEnum.FONT_AWESOME,
          title: 'common.title.add',
          click: 'addOrEdit',
          display: (e: ClientModel) => !e
        }
      },
      {
        columnDef: 'detail',
        icon: 'fa fa-eye',
        iconType: IconTypeEnum.FONT_AWESOME,
        click: 'detail',
        title: 'common.title.detail',
        className: 'info',
        display: (e: ClientModel) => !!e
      },
      {
        columnDef: 'delete',
        icon: 'fa fa-trash-alt',
        iconType: IconTypeEnum.FONT_AWESOME,
        click: 'delete',
        title: 'common.title.delete',
        className: 'danger',
        display: (e: ClientModel) => !!e
      }
    ];
  }

  async ngOnInit() {
    super.ngOnInit();
    this.onSubmit();
  }

  search(): void {
    this.paging.text = this.searchForm.get('text')?.value;
    const params = new HttpParams()
      .set('text', this.paging.text);
    this._fillData('/oauthClient/find', params);
  }

  addOrEdit(client: ClientModel): void {
    if (client) {
      this.dialog.open(AddEditClientComponent, {
        disableClose: false,
        panelClass: 'app-add-edit-client',
        data: {client, isView: false}
      }).afterClosed().subscribe(x => {
        if (x) {
          this.search();
        }
      });
    } else {
      this.dialog.open(AddEditClientComponent, {
        disableClose: false,
        panelClass: 'app-add-edit-client',
      }).afterClosed().subscribe(x => {
        if (x) {
          this.search();
        }
      });
    }
  }

  delete(client: ClientModel) {
    const method = this.apiService.delete('/oauthClient/' + client.clientId);
    this.utilsService.execute(method, this.onSuccessFunc, '.delete.success', 'common.confirmDel',
      ['common.client.param']);
  }

  detail(client: any) {
    this.dialog.open(AddEditClientComponent, {
      disableClose: false,
      panelClass: 'app-add-edit-client',
      data: {client, isView: true}
    });
  }
}
