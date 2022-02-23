import {Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {
    AlignEnum,
    ApiService,
    AuthoritiesService,
    ButtonFields,
    ColumnFields,
    ColumnTypes,
    DateUtilService,
    DialogTypeEnum, FileTypes,
    FormStateService,
    IconTypeEnum,
    SelectModel,
    UtilsService,
} from '@next-solutions/next-solutions-base';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {MatDialogConfig} from '@angular/material/dialog';
import {MangoHitBaseSearch} from '../../../base/mango-hit-base-search';
import {DialogImageComponent} from './dialog-image/dialog-image.component';
import {NzImageService} from 'ng-zorro-antd/image';
import {reportUsersService} from '../report-users.service';
import {HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {CommonUtils} from '../../../_utils/common/common.utils';

export interface Product {
    id?: number,
    product: string;
    productype?: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    action: string
}

const ELEMENT_DATA: Product[] = [];

@Component({
    selector: 'app-report-user-details',
    templateUrl: './report-user-details.component.html',
    styleUrls: ['./report-user-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ReportUserDetailsComponent extends MangoHitBaseSearch implements OnInit {

    moduleName = 'report-users';
    columns: ColumnFields[] = [];
    button: ButtonFields[] = [];
    statusOptions: SelectModel[] = [];
    typeSelectOptions: SelectModel[] = [];
    id?: number;
    order?: any;

    dataSource = ELEMENT_DATA;
    displayedColumns: string[] = ['product', 'name', 'price', 'quantity', 'total', 'action'];

    constructor(protected formBuilder: FormBuilder,
                protected router: Router,
                protected apiService: ApiService,
                public dialog: MatDialog,
                protected reportService: reportUsersService,
                protected utilsService: UtilsService,
                protected uiStateService: FormStateService,
                protected translateService: TranslateService,
                protected injector: Injector,
                protected activatedRoute: ActivatedRoute,
                protected authoritiesService: AuthoritiesService,
                protected dateServiceUtil: DateUtilService,
                private nzImageService: NzImageService,
                protected apollo: Apollo) {
        super(formBuilder, router, apiService, utilsService, uiStateService,
            translateService, injector, activatedRoute, authoritiesService, dateServiceUtil, apollo);
        this.id = +this.activatedRoute.snapshot.params.id
        this.searchForm = this.formBuilder.group({
            searchCode: [''],
            address: ['']
        });
        this.columns.push(...[
            {
                columnDef: 'stt', header: 'stt',
                title: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
                cell: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
                className: 'mat-column-stt',
            },
            {
                columnDef: 'create-date', header: 'create-date',
                title: (e: any) => `${e.item?.files?.file_url ? e.item?.files?.file_url : ''}`,
                cell: (e: any) => `${e.item?.files?.file_url ? e.item?.files?.file_url : ''}`,
                className: 'mat-column-create-date',
            }
            ,
            // {
            //         columnDef: 'content', header: 'content',
            //         title: (e: any) => `${e.item?.files?.file_url ? e.item?.files?.file_url : ''}`,
            //         cell: (e: any) => `${e.item?.files?.file_url ? e.item?.files?.file_url : ''}`,
            //         className: 'mat-column-avatar avatar',
            //         columnType: ColumnTypes.IMG_CONTENT,
            //         link:(e: any) => `${e.item ? e.item.message : ''}`
            // },
            {
                columnDef: 'content', header: 'content',
                title: (e: any) => `${e.item?.files?.file_url ? e.item?.files?.file_url : ''}`,
                cell: (e: any) => `${e.item?.files?.file_url ? e.item?.files?.file_url : ''}`,
                className: 'mat-column-avatar avatar',
            },
            {
                columnDef: 'reporter', header: 'reporter',
                title: (e: any) => `${e.user_report?.display_name ? e.user_report?.display_name : ''}`,
                cell: (e: any) => `${e.user_report?.display_name ? e.user_report?.display_name : ''}`,
                className: 'reporter',
            }

        ]);
        // this.button.push(
        //   {
        //     columnDef: 'approve',
        //     color: 'warn',
        //     iconType: IconTypeEnum.FONT_AWESOME,
        //     icon: 'fa fa-check',
        //     click: 'approve',
        //     isShowHeader: true,
        //     disabled: (e: any) => {
        //       return e.status !== 1;
        //     },
        //     title: 'voucher-management.title.approve',
        //     className: 'primary',
        //     display: (e: any) => true,
        //   },
        // );

    }


    ngOnInit(): void {
        for (let i = 0; i < 5; i++) {
            this.statusOptions.push(new SelectModel(i, this.translateService.instant('voucher-management.status.' + i)));
            this.typeSelectOptions.push(new SelectModel(i, this.translateService.instant('voucher-management.type.' + i)));
        }
        super.ngOnInit();

        this.search();

    }

    resetSearchFormValue(): void {
        this.searchForm.patchValue({
            searchCode: '',
        });
    }

    search(): void {
        const {reportType, status, user, content} = this.searchForm.value;
        let payload = {};
        if (this.activatedRoute.snapshot.params.value !== '0') {
            payload = {
                status: 1,
                report_type: Number(this.activatedRoute.snapshot.params.id),
                report_id: Number(this.activatedRoute.snapshot.params.value)
            }
        } else {
            payload = {
                status: 1,
                report_id: Number(this.activatedRoute.snapshot.params.id)
            }
        }

        const formData = new FormData();
        formData.append('id', this.activatedRoute.snapshot.params.id);
        this.apiService.post('/api/user/getOrderId', formData,
            {
                headers: new HttpHeaders(),
            }, environment.SERVER_BOOK).subscribe((res: any) => {
            this.order = res.data;
            this.order.orderDetail.forEach((item: any) => {
                this.dataSource = [...this.dataSource,
                    {
                        product: item?.image,
                        name: item?.productName,
                        price: item?.price,
                        quantity: item?.count,
                        total: item?.price,
                        action: ''
                    }
                ]
            })

        });


    }


    updateScrumb(event: any) {
        switch (event.label) {
            case 'voucher-management.message.content.approve':
                event.label = 'test';
        }
    }

    formatPublishDate(event: any) {
        const hour = event.getHours().toString().length === 1 ? `0${event.getHours()}` : event.getHours();
        const min = event.getMinutes().toString().length === 1 ? `0${event.getMinutes()}` : event.getMinutes();
        return event.getDate() + '/' + parseInt(event.getMonth() + 1, 0) + '/' + event.getFullYear() + ' ' + hour + ':' + min;
    }

    convertReportType(type: any) {
        if (type === 1) return 'User';
        else if (type === 2) return 'Post';
        else if (type === 3) return 'Comment';
    }

    openDialog() {
        this.dialog.open(DialogImageComponent, {
            data: {
                animal: 'panda'
            },
        });
    }


}
