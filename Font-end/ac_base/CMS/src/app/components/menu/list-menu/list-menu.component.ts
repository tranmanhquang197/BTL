import {Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {HttpParams} from '@angular/common/http';
import {MenuModel} from '../../../_models/MenuModel';
import {AddEditMenuComponent} from '../add-edit-menu/add-edit-menu.component';
import {
  AlignEnum,
  ApiService,
  AuthoritiesService,
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
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListMenuComponent extends BaseSearchLayout implements OnInit {
  menus: any;
  clientOptions: SelectModel[] = [];

  moduleName = 'menu';
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
        title: (e: MenuModel) => `${e.clientId}`,
        cell: (e: MenuModel) => `${e.clientId}`,
        className: 'mat-column-clientId'
      },
      {
        columnDef: 'code',
        header: 'code',
        title: (e: MenuModel) => `${e.code}`,
        cell: (e: MenuModel) => `${e.code}`,
        className: 'mat-column-code'
      },
      {
        columnDef: 'appType',
        header: 'appType',
        title: (e: MenuModel) => `${e.appType}`,
        cell: (e: MenuModel) => `${e.appType}`,
        className: 'mat-column-appType'
      }

    ];

    this.buttons = [
      {
        columnDef: 'addEdit',
        icon: 'fa fa-pen',
        iconType: IconTypeEnum.FONT_AWESOME,
        isShowHeader: true, // AuthoritiesUtils.hasAuthority('post/permissions')
        display: (e: MenuModel) => e && true, // Author
        title: 'common.title.edit',
        click: 'addOrEdit',
        className: 'secondary mat-column-edit',
        header: {
          columnDef: 'addEdit',
          icon: 'fa fa-plus',
          iconType: IconTypeEnum.FONT_AWESOME,
          color: 'primary',
          title: 'common.title.add',
          click: 'addOrEdit',
          display: (e: MenuModel) => !e // && AuthoritiesUtils.hasAuthority('post/permission')
        }
      },
      {
        columnDef: 'delete',
        icon: 'fa fa-trash-alt',
        iconType: IconTypeEnum.FONT_AWESOME,
        click: 'delete',
        title: 'common.title.delete',
        className: 'danger',
        display: (e: MenuModel) => !!e // && AuthoritiesUtils.hasAuthority('delete/permission/{id}'),
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
    this._fillData('/menu/find', params);
  }

  addOrEdit(menu: MenuModel): void {
    if (menu) {
      this.dialog.open(AddEditMenuComponent,
        {
          disableClose: false,
          panelClass: 'app-add-edit-menu',
          data: menu
        })
        .afterClosed().subscribe(x => {
        if (x) {
          this.search();
        }
      });
    } else {
      this.dialog.open(AddEditMenuComponent, {disableClose: false, width: '700px'})
        .afterClosed().subscribe(x => {
        if (x) {
          this.search();
        }
      });
    }
  }

  delete(menu: MenuModel) {
    const method = this.apiService.delete('/menu/' + menu.id + '');
    this.utilsService.execute(method, this.onSuccessFunc, '.delete.success', 'common.confirmDel',
      ['common.menu.param']);
  }

  filterPermissionByClientId() {
    this.search();
  }
}
