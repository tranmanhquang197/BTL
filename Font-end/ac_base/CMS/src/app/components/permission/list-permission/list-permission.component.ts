import {Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpParams} from '@angular/common/http';
import {PermissionModel} from '../../../_models/permission.model';
import {AddEditPermissionComponent} from '../add-edit-permission/add-edit-permission.component';
import {MatDialog} from '@angular/material/dialog';
import {
  AlignEnum,
  ApiService, AuthoritiesService,
  BaseSearchLayout,
  ButtonFields,
  ColumnFields,
  FormStateService,
  SelectModel,
  UtilsService,
  IconTypeEnum
} from '@next-solutions/next-solutions-base';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-list-permission',
  templateUrl: './list-permission.component.html',
  styleUrls: ['./list-permission.component.scss'],
})
export class ListPermissionComponent extends BaseSearchLayout implements OnInit {
  permissions: any;
  clientOptions: SelectModel[] = [];

  moduleName = 'permission';
  columns: ColumnFields[];

  buttons: ButtonFields[];

  constructor(protected router: Router, protected apiService: ApiService, protected utilsService: UtilsService,
              protected formStateService: FormStateService, protected translateService: TranslateService,
              protected injector: Injector, private dialog: MatDialog,
              private fb: FormBuilder,
              protected activatedRoute: ActivatedRoute,
              protected authoritiesService: AuthoritiesService) {
    super(router, apiService, utilsService, formStateService, translateService, injector, activatedRoute, authoritiesService, fb.group({
      text: [''],
      client: ['']
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
        title: (e: PermissionModel) => `${e.clientId}`,
        cell: (e: PermissionModel) => `${e.clientId}`,
        className: 'mat-column-clientId'
      },
      {
        columnDef: 'url',
        header: 'url',
        title: (e: PermissionModel) => `${e.url}`,
        cell: (e: PermissionModel) => `${e.url}`,
        className: 'mat-column-url'
      },
      {
        columnDef: 'description',
        header: 'description',
        title: (e: PermissionModel) => `${e.description}`,
        cell: (e: PermissionModel) => `${e.description}`,
        className: 'mat-column-description'
      }
    ];

    this.buttons = [
      {
        columnDef: 'addEdit',
        icon: 'fa fa-pen',
        iconType: IconTypeEnum.FONT_AWESOME,
        isShowHeader: true, // AuthoritiesUtils.hasAuthority('post/permissions')
        display: (e: PermissionModel) => e && true, // Author
        title: 'common.title.edit',
        click: 'addOrEdit',
        className: 'secondary mat-column-edit',
        header: {
          columnDef: 'addEdit',
          icon: 'fa fa-plus',
          iconType: IconTypeEnum.FONT_AWESOME,
          title: 'common.title.add',
          click: 'addOrEdit',
          display: (e: PermissionModel) => !e // && AuthoritiesUtils.hasAuthority('post/permission')
        }
      },
      {
        columnDef: 'delete',
        icon: 'fa fa-trash-alt',
        iconType: IconTypeEnum.FONT_AWESOME,
        click: 'delete',
        title: 'common.title.delete',
        className: 'danger',
        display: (e: PermissionModel) => !!e // && AuthoritiesUtils.hasAuthority('delete/permission/{id}'),
      }
    ];
  }

  async ngOnInit() {
    const clientPromise = await this.apiService.get('/oauthClient/getClientIds', new HttpParams()).toPromise() as string[];
    this.clientOptions = clientPromise.map(client => new SelectModel(client, client));
    if (this.clientOptions.length > 0) {
      this.searchForm.patchValue({
        client: this.clientOptions[0].value
      });
    }
    super.ngOnInit();
    this.onSubmit();
  }

  search(): void {
    this.paging.text = this.searchForm.get('text')?.value;
    const params = new HttpParams()
      .set('clientId', this.searchForm.get('client')?.value)
      .set('text', this.paging.text);
    this._fillData('/permission/find', params);
  }

  addOrEdit(permission: PermissionModel): void {
    if (permission) {
      this.dialog.open(AddEditPermissionComponent,
        {
          disableClose: false,
          panelClass: 'app-add-edit-permission',
          data: permission
        })
        .afterClosed().subscribe(x => {
        if (x) {
          this.search();
        }
      });
    } else {
      this.dialog.open(AddEditPermissionComponent, {disableClose: false, width: '500px'})
        .afterClosed().subscribe(x => {
        if (x) {
          this.search();
        }
      });
    }
  }

  delete(permission: PermissionModel) {
    const method = this.apiService.delete('/permission/' + permission.id);
    this.utilsService.execute(method, this.onSuccessFunc, '.delete.success', 'common.confirmDel',
      ['common.permission.param']);
  }

  filterPermissionByClientId() {
    this.search();
  }
}
