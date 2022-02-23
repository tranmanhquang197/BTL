import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpParams} from '@angular/common/http';
import {AddEditRoleComponent} from '../add-edit-role/add-edit-role.component';
import {AddEditRolePermissionComponent} from '../add-edit-role-permission/add-edit-role-permission.component';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
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
import { RoleModel } from 'src/app/_models/role.model';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent extends BaseSearchLayout implements OnInit {

  warnConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom'
  };
  roles: any;
  clientOptions: SelectModel[] = [];

  moduleName = 'role';
  columns: ColumnFields[];

  buttons: ButtonFields[];

  constructor(protected router: Router, protected apiService: ApiService, protected utilsService: UtilsService,
              protected formStateService: FormStateService, protected translateService: TranslateService,
              protected injector: Injector, private dialog: MatDialog,
              private fb: FormBuilder,
              protected activatedRoute: ActivatedRoute,
              protected authoritiesService: AuthoritiesService,
              private snackBar: MatSnackBar) {
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
        title: (e: RoleModel) => `${e.clientId}`,
        cell: (e: RoleModel) => `${e.clientId}`,
        className: 'mat-column-clientId'
      },
      {
        columnDef: 'roleName',
        header: 'roleName',
        title: (e: RoleModel) => `${e.roleName}`,
        cell: (e: RoleModel) => `${e.roleName}`,
        className: 'mat-column-roleName'
      },
      {
        columnDef: 'description',
        header: 'description',
        title: (e: RoleModel) => `${e.description}`,
        cell: (e: RoleModel) => `${e.description}`,
        className: 'mat-column-description'
      },
    ];

    this.buttons = [
      {
        columnDef: 'addEdit',
        icon: 'fa fa-pen',
        iconType: IconTypeEnum.FONT_AWESOME,
        isShowHeader: true, // AuthoritiesUtils.hasAuthority('post/permissions')
        display: (e: RoleModel) => e && true, // Author
        title: 'common.title.edit',
        click: 'addOrEdit',
        className: 'secondary mat-column-edit',
        header: {
          columnDef: 'addEdit',
          icon: 'fa fa-plus',
          iconType: IconTypeEnum.FONT_AWESOME,
          title: 'common.title.add',
          click: 'addOrEdit',
          display: (e: RoleModel) => !e // && AuthoritiesUtils.hasAuthority('post/permission')
        }
      },
      {
        columnDef: 'editPermission',
        icon: 'fa fa-users',
        iconType: IconTypeEnum.FONT_AWESOME,
        click: 'editPermission',
        title: 'common.title.edit.permission',
        className: 'info',
        display: (e: RoleModel) => !!e // && AuthoritiesUtils.hasAuthority('delete/permission/{id}'),
      },
      {
        columnDef: 'delete',
        icon: 'delete',
        color: 'primary',
        click: 'delete',
        title: 'common.title.delete',
        className: 'mat-icon-button danger',
        display: (e: RoleModel) => !!e // && AuthoritiesUtils.hasAuthority('delete/permission/{id}'),
      }
    ];
  }

  async ngOnInit() {
    const clientPromise = await this.apiService.get('/oauthClient/getClientIds', new HttpParams()).toPromise() as string[];
    this.clientOptions = clientPromise.map(client => new SelectModel(client, client));
    super.ngOnInit();
    this.onSubmit();
  }

  search(): void {
    this.paging.text = this.searchForm.get('text')?.value;
    const params = new HttpParams()
      .set('clientId', this.searchForm.get('client')?.value)
      .set('text', this.paging.text);
    this._fillData('/role/find', params);
  }

  addOrEdit(role: RoleModel): void {
    if (role) {
      this.dialog.open(AddEditRoleComponent,
        {
          disableClose: false,
          panelClass: 'app-add-edit-role',
          data: role
        })
        .afterClosed().subscribe(result => {
        if (result.value) {
          this.search();
        }
      });
    } else {
      this.dialog.open(AddEditRoleComponent,
        {
          disableClose: false,
          width: '700px'
        })
        .afterClosed().subscribe((result: any) => {
        if (result.value) {
          this.search();
        }
      });
    }
  }

  delete(role: any) {
    if (role.menus.length === 0 && role.permissions.length === 0) {
      const method = this.apiService.delete('/role/' + role.id);
      this.utilsService.execute(method, this.onSuccessFunc, '.delete.success', 'common.confirmDel',
        ['common.role.param']);
    } else {
      this.snackBar.open('This role has some menu and permission, please delete all first!!!', '', this.warnConfig);
    }

  }

  filterPermissionByClientId() {
    this.search();
  }

  editPermission(role: any) {
    this.dialog.open(AddEditRolePermissionComponent, {
      disableClose: false,
      width: '90%',
      maxWidth: '90%',
      height: '500px',
      data: role
    }).afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }

    });
  }
}
