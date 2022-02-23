import {Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {
    AlignEnum,
    ApiService,
    AuthoritiesService,
    BaseSearchLayout, DateRangePickerModel, DateUtilService,
    FormStateService, LoaderService, Paging, ButtonFields,
    ColumnFields,
    UtilsService, SelectModel, IconTypeEnum, ColumnTypes, Page, SuperEntity, DialogTypeEnum,
} from '@next-solutions/next-solutions-base';


import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {environment} from 'src/environments/environment';
import {Level} from '../../_models/level/level.model';
import {MatTableDataSource} from '@angular/material/table';
import {userRoleStatus, userStatus} from '../../_models/enums/users.enum';
import {UsersService} from "./users.service";

// static  convertUrlImage(url:any){
//     const urlImage = url.split('mxc://');
//     console.log('url : ',environment.BASE_URL_IMAGE+'/'+ urlImage[1] + '?width=96&height=96&method=crop');
//     return environment.BASE_URL_IMAGE+'/'+ urlImage[1] + '?width=96&height=96&method=crop';
// }

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
// @ts-ignore
export class UsersComponent extends BaseSearchLayout implements OnInit {


    statusOptions: SelectModel[] = [];
    guestOptions: SelectModel[] = [];
    roleOptions: SelectModel[] = [];
    buttons: ButtonFields[] = [];
    moduleName = 'users';
    statusVehicle = [];

    constructor(protected formBuilder: FormBuilder,
                protected router: Router,
                protected apiService: ApiService,
                protected utilsService: UtilsService,
                protected uiStateService: FormStateService,
                protected translateService: TranslateService,
                protected injector: Injector,
                public usersService: UsersService,
                protected activatedRoute: ActivatedRoute,
                protected authoritiesService: AuthoritiesService,
                public dateServiceUtil: DateUtilService,
                public loaderService: LoaderService,
                private httpClient: HttpClient,
                private matDialog: MatDialog
    ) {
        super(router, apiService, utilsService, uiStateService, translateService, injector, activatedRoute, authoritiesService,
            formBuilder.group({
                name: [''],
                status: [-1],
                role: [-1],
                phone: ['']
            }));


        this.columns.push(...[
            {
                columnDef: 'stt', header: 'stt',
                title: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
                cell: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
                className: 'mat-column-stt',
            },
            {
                columnDef: 'avatar', header: 'avatar',
                title: (e: any) => `${e.image ? this.convertUrlImage(e.image) : ''}`,
                cell: (e: any) => `${e.image ? this.convertUrlImage(e.image) : ''}`,
                className: 'mat-column-avatar avatar',
                columnType: ColumnTypes.IMG_NO_SECURE,
            }
            ,
            {
                columnDef: 'displayname', header: 'displayname',
                title: (e: any) => `${e.username ? e.username : ''}`,
                cell: (e: any) => `${e.username ? e.username : ''}`,
                className: 'user-displayname',
            },
            {
                columnDef: 'phone', header: 'phone',
                title: (e: any) => `${e.phone ? e.phone : ''}`,
                cell: (e: any) => `${e.phone ? e.phone : ''}`,
                className: 'mat-column-phone phone',
            },
            {
                columnDef: 'status', header: 'status',
                title: (e: any) => `${e.status === 0 ? 'Active' : 'Lock'}`,
                cell: (e: any) => `${e.status === 0 ? 'Active' : 'Lock'}`,
                className: 'user-status',
            },
            {
                columnDef: 'admin', header: 'admin',
                title: (e: any) => `${e.roles ? e.roles : ''}`,
                cell: (e: any) => `${e.roles ? e.roles : ''}`,
                className: 'user-admin',
            }

        ]);

        this.buttons.push(
            {
                columnDef: 'active',
                color: 'warn',
                icon: 'fa fa-eye',
                iconType: IconTypeEnum.FONT_AWESOME,
                click: 'active',
                isShowHeader: true,
                className: 'danger',
                header: 'common.label.action',
                title: 'users.title.unblock',
                display: (e: any) => {
                    return e.status !== 0;
                }
            },
            {
                columnDef: 'deactive',
                color: 'warn',
                icon: 'fas fa-eye-slash',
                iconType: IconTypeEnum.FONT_AWESOME,
                click: 'deactive',
                isShowHeader: true,
                className: 'danger',
                header: 'common.label.action',
                title: 'users.title.block',
                display: (e: any) => {
                    return e.status === 0;
                }
            }
        );

    }


    ngOnInit(): void {
        this.statusOptions = [];
        Object.keys(userStatus).forEach(key => {
            const value = userStatus[key].statusType;
            const displayValue = userStatus[key].label;
            this.statusOptions.push(new SelectModel(value, displayValue));
        });

        this.roleOptions = [];
        Object.keys(userRoleStatus).forEach(key => {
            const value = userRoleStatus[key].statusType;
            const displayValue = userRoleStatus[key].label;
            this.roleOptions.push(new SelectModel(value, displayValue));
        });

        super.ngOnInit();
        this.search();
    }

    resetSearchFormValue(): void {
        this.searchForm.patchValue({
            name: [''],
            status: -1,
            role: -1,
            phone: ['']
        });
    }

    convertUrlImage(url: any) {
        let urlImage = [];
        urlImage = url.split('mxc://');
        return environment.BASE_URL_IMAGE + '/' + urlImage[1] + '?width=96&height=96&method=crop';
    }
    convertPhone(phone: any) {
        const lstPhoneA = phone.split('@');
        const lstPhone = lstPhoneA[1].split(':');
        return lstPhone[0];
    }

    search(): void {
        this._fillDataByPostMethod('/api/user/searchUser', {params: new HttpParams()},environment.SERVER_BOOK);
    }


    // @ts-ignore
    _fillDataByPostMethod(nativeUrl: string, options: { params: HttpParams }, baseUrl?: string) {
        // @ts-ignore
        options = this.updateHttpParams(options.params);
        // @ts-ignore
        this.apiService.post(nativeUrl, options, baseUrl).subscribe(this.afterFillData)
    }


    private updateHttpParams(params: HttpParams): HttpParams {
        const emptyValuesKey = params.keys().filter(key => !params.get(key));
        emptyValuesKey.forEach(key => {
            params = params.delete(key);
        });
        const {name, status, role, phone} = this.searchForm.value;
        if (!params.keys().includes('pageNumber')) {
            // if (role !== -1) {
            //     params = params.append('name', '');
            // }
            // if (status !== -1) {
            //     params = params.append('phone', '');
            // }
            // if (name) {
            //     params = params.append('status', '');
            // }
            // if (phone) {
            //     params = params.append('roles', '');
            // }

            params = params.append('name', '');
            params = params.append('phone', '');
            params = params.append('status', '');
            params = params.append('roles', '');

            params = params.append('pageNumber', this.isResetPaging ? '0' : (this.paging ? (this.paging.pageNumber - 1).toString() : '0'))
                .append('pageSize', this.paging ? this.paging.pageSize.toString() : this.config.PAGE_SIZE.toString())
            ;
        }
        return params;
    }

    private afterFillData = (datas: Page | any) => {
        const data = datas.data;
        this.isResetPaging = false;
        if (data.content && data.content.length > 0) {
            this.columns.forEach((column: ColumnFields) => {
                column.isShowHeader = false;
            });
        }

        this.results = new MatTableDataSource<SuperEntity>(data?.content);
        this.paging = new Paging();
        this.paging.pageSize = data.size ? data.size : 0;
        this.paging.pageNumber = (data.number ? data.number : 0) + 1;
        this.paging.totalElements = data.numberOfElements ? data.numberOfElements : 0;


    };


    deleteAccount(element: any) {
        const strOk = this.translateService.instant('common.OK');
        const strCancel = this.translateService.instant('common.Cancel');
        const dialogConfig: MatDialogConfig<any> = {
            data: {
                customClass: 'reject_reason_dialog',
                msg: this.translateService.instant('common.action*.4'),
                msgDetail: this.translateService.instant('users.message.content.delete'),
                type: DialogTypeEnum.CONFIRM,
                btnOKString: strOk,
                btnCancelString: strCancel,
            },
        };

        this.utilsService.showConfirmDialog('users.message.content.delete', [],
            '', [])
            .afterClosed().subscribe(next => {
            if (next && next.value === 1) {
                const headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded');
                const body = {
                    erase: true
                }
                const name = element.name;
                return this.apiService.post('/_synapse/admin/v1/deactivate/' + name, body, {}, environment.CHAT_SERVER_URL)
                    .subscribe(_ => {
                        this.onSuccessFunc(null, 'users.message.success.delete');
                        this.search();
                    }, _ => {
                        this.utilsService.showErrorToarst(_.message.split('"')[1]);
                    });

            }
        });
    }

    deactive(element: any) {
        const strOk = this.translateService.instant('common.OK');
        const strCancel = this.translateService.instant('common.Cancel');
        const dialogConfig: MatDialogConfig<any> = {
            data: {
                customClass: 'reject_reason_dialog',
                msg: this.translateService.instant('common.action*.4'),
                msgDetail: this.translateService.instant('users.message.content.block'),
                type: DialogTypeEnum.CONFIRM,
                btnOKString: strOk,
                btnCancelString: strCancel,
            },
        };

        this.utilsService.showConfirmDialog('users.message.content.block', [],
            '', [])
            .afterClosed().subscribe(next => {
            if (next && next.value === 1) {
                const headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded');
                const body = {
                    is_lock: true
                }
                const name = element.name;
                return this.apiService.post('/_synapse/admin/v1/lock/' + name, body, {}, environment.CHAT_SERVER_URL)
                    .subscribe(_ => {
                        this.onSuccessFunc(null, 'users.message.success.block');
                        this.search();
                    }, _ => {
                        this.utilsService.showErrorToarst(_.message.split('"')[1]);
                    });
            }
        });
    }

    onRowClickAction(event:any){
        this.router.navigate(['/users/user-detail/' + event.object.id]).then();
    }


}
