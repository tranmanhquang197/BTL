import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
    AlignEnum,
    ApiService,
    AuthoritiesService,
    ButtonFields,
    ColumnFields,
    ColumnTypes,
    DateUtilService, DialogTypeEnum,
    FormStateService, IconTypeEnum, SelectModel,
    UtilsService,
} from '@next-solutions/next-solutions-base';
import {HttpParams} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VoucherService} from '../voucher-management/shared/voucher.service';
import {MangoHitBaseSearch} from '../../base/mango-hit-base-search';
import {Apollo} from 'apollo-angular';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {billLadingStatusAction} from '../../_models/enums/bill.lading.status.enum';
import {voucherStatusAction} from '../../_models/enums/voucher.status.enum';
import {error} from 'ng-packagr/lib/utils/log';
import {Voucher} from '../../_models/voucher/voucher.model';
import {DialogImportFileComponent, DialogImportFileDataConfig} from '../../base/ns-upload/dialog-import-file.component';
import {environment} from 'src/environments/environment';
import {Observable, of, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {userStatus, UserSystemStatus} from "../../_models/enums/users.enum";

@Component({
    selector: 'app-customer-care',
    templateUrl: './customer-care.component.html',
    styleUrls: ['./customer-care.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CustomerCareComponent extends MangoHitBaseSearch implements OnInit ,OnDestroy{

    moduleName = 'customer-care';
    columns: ColumnFields[] = [];
    button: ButtonFields[] = [];
    statusOptions: SelectModel[] = [];
    statusUserSystemOptions: SelectModel[] = [];
    typeSelectOptions: SelectModel[] = [];

    constructor(protected formBuilder: FormBuilder,
                protected router: Router,
                protected apiService: ApiService,
                protected utilsService: UtilsService,
                protected uiStateService: FormStateService,
                protected translateService: TranslateService,
                protected injector: Injector,
                protected activatedRoute: ActivatedRoute,
                protected authoritiesService: AuthoritiesService,
                protected dateServiceUtil: DateUtilService,
                private voucherService: VoucherService,
                protected apollo: Apollo,
                private dialog: MatDialog,
                private http: HttpClient
    ) {
        super(formBuilder, router, apiService, utilsService, uiStateService,
            translateService, injector, activatedRoute, authoritiesService, dateServiceUtil, apollo);
        this.searchForm = this.formBuilder.group({
            namePhone: [undefined],
            address: [undefined],
            userSystem:[3]
        });
        this.columns.push(
            {
                columnDef: 'number', header: 'number',
                title: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
                cell: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
                className: 'mat-column-stt',
                align: AlignEnum.CENTER,
            },
            {
                columnDef: 'full-name', header: 'full-name',
                title: (e: any) => `${e.name ? e.name : ''}`,
                cell: (e: any) => `${e.name ? e.name : ''}`,
                className: 'customer-care-name',
            },
            {
                columnDef: 'phone', header: 'phone',
                title: (e: any) => `${e.phone_number ? e.phone_number : ''}`,
                cell: (e: any) => `${e.phone_number ? e.phone_number : ''}`,
                className: 'customer-care-phone',
            },
            {
                columnDef: 'sex', header: 'sex',
                title: (e: any) => `${e.gender ? e.gender : ''}`,
                cell: (e: any) => `${e.gender ? e.gender : ''}`,
                className: 'customer-care-sex',
            },
            {
                columnDef: 'user', header: 'user',
                title: (e: any) => `${e.is_user ? this.translateService.instant('customer-care.status.in_system')  : this.translateService.instant('customer-care.status.outside_system')}`,
                cell: (e: any) => `${e.is_user ? this.translateService.instant('customer-care.status.in_system')  : this.translateService.instant('customer-care.status.outside_system')}`,
                className: 'customer-user',
            },
            {
                columnDef: 'address', header: 'address',
                title: (e: any) => `${e.address ? e.address : ''}`,
                cell: (e: any) => `${e.address ? e.address : ''}`,
                className: 'customer-care-address',
            }
        );

    }


    ngOnInit(): void {
        super.ngOnInit();
        this.statusUserSystemOptions = [];
        Object.keys(UserSystemStatus).forEach(key => {
            const value = UserSystemStatus[key].statusType;
            const displayValue = UserSystemStatus[key].label;
            this.statusUserSystemOptions.push(new SelectModel(value, displayValue));
        });
        this.search();
    }

    resetSearchFormValue(): void {
        this.searchForm.patchValue({
            namePhone: '',
            address: '',
            userSystem:[3]
        });
    }

    search(): void {

        const {namePhone,userSystem} = this.searchForm.value;
        // if(publish_date_from && publish_date_to && publish_date_from > publish_date_to){
        //   this.utilsService.showErrorToarst('common.error.toDateMustGreaterThanOrEqualFromDate');
        //   return;
        // }
        // is_user  = 3 là tất cả người dùng của hệ thống
        this.customFilterData(this.voucherService.GET_CUSTOMER, {
            is_user: userSystem,
            search_code: namePhone ? namePhone.toString().trim() :''
        });
    }


    onDownloadTemplate = () => {
        const param = new HttpParams().set('clientId', this.searchForm.get('clientId')?.value + '');
        this.apiService.saveFile('/policies/download-template', null, {
            headers: undefined,
            params: param
        }, environment.BASE_BILLING_URL);
    };


    onImportPolicies = (file: File): Observable<any> => {
        let obs: Observable<any> = of(null);
        if (file) {
            const formData = new FormData();
            formData.set('file', file);
            obs = this.apiService.post('/importCustomer', formData, undefined, environment.BASE_CHAT_URL)
        }
        return obs;
    }

    onFileSelect() {
        this.dialog.open(DialogImportFileComponent, {
            width: '40rem',
            height: '30rem',
            data: {
                importFunc: this.onImportPolicies,
                confirmMsgKey: 'Do you want to upload the excel file ?',
                successMsgKey: 'Import excel file success',
                errorMsgKey: 'Import excel file error !',

            } as DialogImportFileDataConfig
        }).afterClosed().subscribe(done => {
            if (done) {
                this.search();
            }
        });
    }

    onExportExcel() {
        let params = new HttpParams();
        params = params.set('language', 'vi');
        this.apiService.saveFile('/downloadSampleExcel', null, {
            headers: undefined,
            params
        }, environment.BASE_CHAT_URL);
    }


}
