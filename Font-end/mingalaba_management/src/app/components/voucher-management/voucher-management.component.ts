import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  AlignEnum,
  ApiService,
  AuthoritiesService, BaseSearchLayout,
  ButtonFields,
  ColumnFields,
  ColumnTypes,
  DateUtilService, DialogTypeEnum, FlatTreeConfigConvertObject, FlatTreeNode,
  FormStateService, IconTypeEnum, Page, Paging, SelectModel, SuperEntity,
  UtilsService,
} from '@next-solutions/next-solutions-base';

import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherService } from '../voucher-management/shared/voucher.service';
import { MangoHitBaseSearch } from '../../base/mango-hit-base-search';
import { Apollo } from 'apollo-angular';
import { MatDialogConfig } from '@angular/material/dialog';
import { billLadingStatusAction } from '../../_models/enums/bill.lading.status.enum';
import { voucherStatusAction } from '../../_models/enums/voucher.status.enum';
import { error } from 'ng-packagr/lib/utils/log';
import { Voucher } from '../../_models/voucher/voucher.model';
import {Subscription} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-voucher-management',
  templateUrl: './voucher-management.component.html',
  styleUrls: ['./voucher-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VoucherManagementComponent extends BaseSearchLayout implements OnInit, OnDestroy {

  moduleName = 'voucher-management';
  columns: ColumnFields[] = [];
  button: ButtonFields[] = [];
  statusOptions: SelectModel[] = [];
  typeSelectOptions: SelectModel[] = [];
  DisableFromToDate = false;



  minToDate = () => {
    const { publish_date_from } = this.searchForm?.value;
    const dateNow = this.convertStringDateToDateFormat(this.dateUtilService
        .convertDateToStringCurrentGMT
        (publish_date_from)?.substring(0, 10) + '');
    if (publish_date_from) {
      // @ts-ignore
      const date = this.dateUtilService.convertToDateIgnoreTimeZone(dateNow);
      if (date) {
        return this.dateUtilService.addDays(date, 1);
      }
    }
    return new Date(1900, 1, 1);
  };


  convertStringDateToDateFormat(date: string): string | null {
    return date + ' 00:00:00.000Z';
  }

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
              private dateUtilService: DateUtilService,
              private voucherService: VoucherService,
              protected apollo: Apollo) {
    super(router, apiService, utilsService, uiStateService, translateService, injector, activatedRoute, authoritiesService,
        formBuilder.group({
          Name: [''],
          business_name: [''],
          publish_date_from: [''],
          publish_date_to: [''],
          status: ['']
        }));



    this.columns.push(
        {
          columnDef: 'number', header: 'number',
          title: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
          cell: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
          className: 'mat-column-stt',
        },
      {
        columnDef: 'image', header: 'image',
        title: (e: any) => `${e.url ? e.url : ''}`,
        cell: (e: any) => `${e.url ? e.url : ''}`,
        className: 'mat-column-image',
        columnType: ColumnTypes.IMG_CUSTOMER,
      },
        {
          columnDef: 'name', header: 'name',
          title: (e: any) => `${e.name ? e.name : ''}`,
          cell: (e: any) => `${e.name ? e.name : ''}`,
          className: 'mat-column-name',
        },
      {
        columnDef: 'quantity', header: 'quantity',
        title: (e: any) => `${e.count ? e.count : ''}`,
        cell: (e: any) => `${e.count ? e.count : ''}`,
        className: 'mat-column-quantity',
      },
      {
        columnDef: 'rest', header: 'rest',
        title: (e: any) => `${e.rest === 0 ? 0 : e.rest}`,
        cell: (e: any) => `${e.rest === 0 ? 0 : e.rest}`,
        className: 'mat-column-rest',
      },
      {
        columnDef: 'status', header: 'status',
        title: (e: any) => `${e.status  === 0? 0 : e.status}`,
        cell: (e: any) => `${e.status === 0? 0 : e.status}`,
        className: 'mat-column-status',
      },
      {
        columnDef: 'product.type', header: 'product.type',
        title: (e: any) => `${e.product_types ? e.product_types : ''}`,
        cell: (e: any) => `${e.product_types ? e.product_types : ''}`,
        className: 'mat-column-product-type',
      },
        {
          columnDef: 'price', header: 'price',
          title: (e: any) => `${e.price ? e.price : ''}`,
          cell: (e: any) => `${e.price ? e.price : ''}`,
          className: 'mat-column-price',
        },
      {
        columnDef: 'create.date', header: 'create.date',
        title: (e: any) => `${e.create_date ? e.create_date : ''}`,
        cell: (e: any) => `${e.create_date ? e.create_date : ''}`,
        className: 'mat-column-create-date',
      },
    );
    this.button.push(

    );

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
      title: '',
      business_name: '',
      status: 0,
      publish_date_from: '',
      publish_date_to: '',
    });
  }

  search(): void {

    // const { title, status, business_name, publish_date_from, publish_date_to } = this.searchForm.value;
    // if(publish_date_from && publish_date_to && publish_date_from > publish_date_to){
    //   this.utilsService.showErrorToarst('common.error.toDateMustGreaterThanOrEqualFromDate');
    //   return;
    // }
    // this.customFilterData(this.voucherService.GET_ALL, {
    //   title: title ? title : null,
    //   business_name: business_name ? business_name : null,
    //   status: status !== null && status !== undefined && status !== '' ? status : null,
    //   publish_date_from: publish_date_from ? this.dateServiceUtil.convertDateToStringGMT0(publish_date_from) : null,
    //   publish_date_to: publish_date_to ? this.dateServiceUtil.convertDateToStringGMT0(publish_date_to) : null,
    // });

    this._fillDataByPostMethod('/api/user/searchProduct', {params: new HttpParams()}, environment.SERVER_BOOK);

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
      params = params.append('productType', '');
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

  active(element: any) {
    const strOk = this.translateService.instant('common.OK');
    const strCancel = this.translateService.instant('common.Cancel');
    const dialogConfig: MatDialogConfig<any> = {
      data: {
        customClass: 'reject_reason_dialog',
        msg: this.translateService.instant('common.action*.4'),
        msgDetail: this.translateService.instant('voucher-management.message.content.delete'),
        type: DialogTypeEnum.CONFIRM,
        btnOKString: strOk,
        btnCancelString: strCancel,
      },
    };

    this.utilsService.showConfirmDialog('voucher-management.message.content.delete', [],
      '', [])
      .afterClosed().subscribe(next => {
      if (next && next.value === 1) {
        this.voucherService.deleteVoucher(element.id).subscribe(_ => {
          this.onSuccessFunc(null, 'common.deleteSuccess');
          this.search();
        }, _ => {
          this.utilsService.showErrorToarst(_.message.split('"')[1]);
        });
      }
    });
  }

  approve(element: any) {
    const strOk = this.translateService.instant('common.OK');
    const strCancel = this.translateService.instant('common.Cancel');
    const dialogConfig: MatDialogConfig<any> = {
      data: {
        customClass: 'reject_reason_dialog',
        msg: this.translateService.instant('common.action*.4'),
        msgDetail: this.translateService.instant('voucher-management.message.content.approve'),
        type: DialogTypeEnum.CONFIRM,
        btnOKString: strOk,
        btnCancelString: strCancel,
      },
    };

    this.utilsService.showConfirmDialog('voucher-management.message.content.approve', [],
      '', [])
      .afterClosed().subscribe(next => {
      if (next && next.value === 1) {
        this.voucherService.approveVoucher(element.id).subscribe(_ => {
          this.onSuccessFunc(null, 'common.success');
          this.search();
        }, _ => {
          this.utilsService.showErrorToarst(_.message.split('"')[1]);
        });
      }
    });
  }

  createVoucher() {
    this.router.navigate([this.router.url, 'add']);
  }

  addOrEdit(voucher: Voucher | undefined) {
    if (voucher) {
      this.router.navigate(['/voucher/edit/' + voucher.id]).then();
    } else {
      this.router.navigate(['/voucher/add']).then();
    }
  }

  view(voucher: Voucher | undefined) {
    if (voucher) {
      this.router.navigate(['/voucher/voucher-detail/' + voucher.id]).then();
    }
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

  checkDisableFromToDate(){
    const fromDate = this.searchForm?.get('publish_date_from')?.value;
    const toDate = this.searchForm?.get('publish_date_to')?.value;
    if (fromDate && !toDate) {
      this.DisableFromToDate = true;
      return;
    }
    if (!fromDate && toDate){
      this.DisableFromToDate = true;
      return;
    }
    this.DisableFromToDate = false;
    return false;
  }

  changeDateFrom(event:any){
    this.checkDisableFromToDate();
  }
  changeDateTo(event:any){
    this.checkDisableFromToDate();
  }


  onRowClickAction(event:any){
    this.router.navigate(['/voucher/voucher-detail/' + event.object.id]).then();
  }


}
