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
import {userRoleStatus, userStatus, UserSystemStatus} from '../../_models/enums/users.enum';
import {reportUsersService} from './report-users.service';
import {Apollo} from 'apollo-angular';
import {MangoHitBaseSearch} from '../../base/mango-hit-base-search';
import {ReportUserStatus, ReportUserType} from '../../_models/enums/report.users.enum';


@Component({
    selector: 'app-users',
    templateUrl: './report-users.component.html',
    styleUrls: ['./report-users.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
// @ts-ignore
export class ReportUsersComponent extends MangoHitBaseSearch implements OnInit {


    statusOptions: SelectModel[] = [];
    typeOptions: SelectModel[] = [];
    buttons: ButtonFields[] = [];
    moduleName = 'report-users';
    columns: ColumnFields[] = [];
    button: ButtonFields[] = [];
    statusVehicle = [];

    listOrder = [{
        index: 1,
        image: '/assets/files/kinhdoanh/11nguyentac.jpg',
        name: '11 nguyên tắc làm giàu',
        order_name: 'Sáng',
        quantity: '3',
        price: '120.000 VNĐ',
        total_price: '360.000 VNĐ',
        status: 'Confirm',
        create_date: '21-07-2021'
    }
        ,
        {
            index: 2,
            image: '/assets/files/sachnauan/40loaimut.jpg',
            name: '40 loại mứt',
            order_name: 'Công',
            quantity: '1',
            price: '90.000 VNĐ',
            total_price: '90.000 VNĐ',
            status: 'Shipping',
            create_date: '23-07-2021'
        },
        {
            index: 3,
            image: '/assets/files/sachvanhoc/ac_quy.jpg',
            name: 'Ác quỷ',
            order_name: 'Duy',
            quantity: '2',
            price: '120.000 VNĐ',
            total_price: '240.000 VNĐ',
            status: 'Success',
            create_date: '25-07-2021'
        }

    ]

    constructor(protected formBuilder: FormBuilder,
                protected router: Router,
                protected apiService: ApiService,
                protected utilsService: UtilsService,
                protected uiStateService: FormStateService,
                protected translateService: TranslateService,
                protected injector: Injector,
                protected reportService: reportUsersService,
                protected activatedRoute: ActivatedRoute,
                protected authoritiesService: AuthoritiesService,
                protected dateServiceUtil: DateUtilService,
                private dateUtilService: DateUtilService,
                protected apollo: Apollo) {
        super(formBuilder, router, apiService, utilsService, uiStateService,
            translateService, injector, activatedRoute, authoritiesService, dateServiceUtil, apollo);
        this.searchForm = this.formBuilder.group({
            status: -1,
            reportType: -1,
            user: [''],
            content: [''],
        });

        this.columns.push(...[
            {
                columnDef: 'stt', header: 'stt',
                title: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
                cell: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
                className: 'mat-column-stt',
            }
            ,
            {
                columnDef: 'image', header: 'image',
                title: (e: any) => `${e.image ? e.image : ''}`,
                cell: (e: any) => `${e.image ? e.image : ''}`,
                className: 'mat-column-image',
                columnType: ColumnTypes.IMG_CUSTOMER,
            },
            {
                columnDef: 'name', header: 'name',
                title: (e: any) => `${e.name ? e.name : ''}`,
                cell: (e: any) => `${e.name ? e.name : ''}`,
                className: 'mat-column-name'
            },
            {
                columnDef: 'order-name', header: 'order-name',
                title: (e: any) => `${e.orderName ? e.orderName : ''}`,
                cell: (e: any) => `${e.orderName ? e.orderName : ''}`,
                className: 'mat-column-order-name',
            },
            {
                columnDef: 'total-price', header: 'total-price',
                title: (e: any) => `${e.price ? e.price : ''}`,
                cell: (e: any) => `${e.price ? e.price : ''}`,
                className: 'mat-column-total-price',
            },
            {
                columnDef: 'status', header: 'status',
                title: (e: any) => `${e.status === 0 ? 'Reconfirm' : ''}`,
                cell: (e: any) => `${e.status === 0 ? 'Reconfirm' : ''}`,
                className: 'mat-column-create-date'
            },
            {
                columnDef: 'create-date', header: 'create-date',
                title: (e: any) => `${e.create_date ? e.create_date : ''}`,
                cell: (e: any) => `${e.create_date ? e.create_date : ''}`,
                className: 'mat-column-create-date'
            }


        ]);
    }


    ngOnInit(): void {

        Object.keys(ReportUserStatus).forEach(key => {
            const value = ReportUserStatus[key].statusType;
            const displayValue = ReportUserStatus[key].label;
            this.statusOptions.push(new SelectModel(value, displayValue));
        });

        this.typeOptions = [];
        Object.keys(ReportUserType).forEach(key => {
            const value = ReportUserType[key].statusType;
            const displayValue = ReportUserType[key].label;
            this.typeOptions.push(new SelectModel(value, displayValue));
        });

        super.ngOnInit();
        this.search();
    }

    search(): void {
        // const {reportType, status, user, content} = this.searchForm.value;
        //
        // this.customFilterData(this.reportService.GET_USER_REPORT, {
        //         status: reportType === -1 ? null:reportType,
        //         search_user:user,
        //         report_type:reportType === -1 ? null:reportType,
        //         search_content:content
        // });

        this._fillDataByPostMethod('/api/user/searchOrder', {params: new HttpParams()}, environment.SERVER_BOOK);

    }

    onRowClickAction(event: any) {
        this.router.navigate(['/report-users/details/' + event.object.id]).then();
    }

    resetSearchFormValue(): void {
        this.searchForm.patchValue({
            status: -1,
            reportType: -1,
            user: [''],
            content: [''],
        });
    }

    convertReportType(type: any) {
        if (type === 1) return 'User';
        else if (type === 2) return 'Post';
        else if (type === 3) return 'Comment';
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
            //   params = params.append('name', 'Iphone 3');
            // }
            // if (status !== -1) {
            //   params = params.append('is_block', status === 0 ? '0' : '1');
            // }
            // if (name) {
            //   params = params.append('display_name', name.toString().trim());
            // }
            // if (phone) {
            //   params = params.append('user_id', phone.toString().trim());
            // }
            params = params.append('name', '');
            params = params.append('status', '');
            params = params.append('fromDate', '');
            params = params.append('toDate', '');

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


}
