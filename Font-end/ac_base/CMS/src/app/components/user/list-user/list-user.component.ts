import {Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserModel} from '../../../_models/user.model';
import {FormBuilder} from '@angular/forms';
import {HttpParams} from '@angular/common/http';
import {AddEditUserComponent} from '../add-edit-user/add-edit-user.component';
import {MultilanguagePanigator} from '../../../_helpers/multilanguage.paginator';
import {AddRoleUserComponent} from '../add-role-user/add-role-user.component';
import {MatPaginatorIntl} from '@angular/material/paginator';
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
  UtilsService,
  IconTypeEnum
} from '@next-solutions/next-solutions-base';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  providers: [
    {provide: MatPaginatorIntl, useClass: MultilanguagePanigator}
  ],
  encapsulation: ViewEncapsulation.None
})
export class ListUserComponent extends BaseSearchLayout implements OnInit {

  warnConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom'
  };

  moduleName = 'user';
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
        columnDef: 'username',
        header: 'username',
        title: (e: UserModel) => `${e.username}`,
        cell: (e: UserModel) => `${e.username}`,
        className: 'mat-column-username'
      },
      {
        columnDef: 'firstName',
        header: 'firstName',
        title: (e: UserModel) => `${e.firstName}`,
        cell: (e: UserModel) => `${e.firstName}`,
        className: 'mat-column-firstName'
      },
      {
        columnDef: 'lastName',
        header: 'lastName',
        title: (e: UserModel) => `${e.lastName}`,
        cell: (e: UserModel) => `${e.lastName}`,
        className: 'mat-column-lastName'
      },
    ];

    this.buttons = [
      {
        columnDef: 'addEdit',
        icon: 'fa fa-pen',
        iconType: IconTypeEnum.FONT_AWESOME,
        isShowHeader: true,
        display: (e: UserModel) => e && true, // Author
        title: 'common.title.edit',
        click: 'addOrEdit',
        className: 'secondary mat-column-edit',
        header: {
          columnDef: 'addEdit',
          icon: 'fa fa-plus',
          iconType: IconTypeEnum.FONT_AWESOME,
          title: 'common.title.add',
          click: 'addOrEdit',
          display: (e: UserModel) => !e
        }
      },
      {
        columnDef: 'addRole',
        icon: 'fa fa-users',
        iconType: IconTypeEnum.FONT_AWESOME,
        click: 'addRole',
        title: 'common.title.addRole',
        className: 'info',
        display: (e: UserModel) => !!e
      },
      {
        columnDef: 'delete',
        icon: 'fa fa-trash-alt',
        iconType: IconTypeEnum.FONT_AWESOME,
        click: 'delete',
        title: 'common.title.delete',
        className: 'danger',
        display: (e: UserModel) => !!e
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
    this._fillData('/user/find', params);
  }

  addOrEdit(user: UserModel): void {
    if (user) {
      this.dialog.open(AddEditUserComponent,
        {
          disableClose: false,
          panelClass: 'app-add-user',
          data: user
        })
        .afterClosed().subscribe(x => {
        if (x) {
          this.search();
        }
      });
    } else {
      this.dialog.open(AddEditUserComponent, {disableClose: false, width: '500px'})
        .afterClosed().subscribe(x => {
        if (x) {
          this.search();
        }
      });
    }
  }

  delete(user: UserModel) {
    if (user.roles.length === 0) {
      const method = this.apiService.delete('/user/' + user.id);
      this.utilsService.execute(method, this.onSuccessFunc, '.delete.success', 'common.confirmDel',
        ['common.user.param']);
    } else {
      this.snackBar.open('This user has some role, please delete all user\'s roles first!!!', '', this.warnConfig);
    }
  }

  addRole(user: UserModel) {
    this.dialog.open(AddRoleUserComponent, {
      disableClose: false,
      width: '60%',
      maxWidth: '90%',
      maxHeight: '90vh',
      data: user
    }).afterClosed().subscribe(x => {
      if (x) {
        this.search();
      }
    });
  }
}
