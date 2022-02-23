import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AlignEnum,
  ApiService,
  AuthoritiesService,
  ButtonFields,
  ColumnFields,
  ColumnTypes,
  DateUtilService,
  DialogTypeEnum,
  FormStateService,
  IconTypeEnum,
  SelectModel,
  UtilsService,
} from '@next-solutions/next-solutions-base';

import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { MatDialogConfig } from '@angular/material/dialog';
import { MangoHitBaseSearch } from '../../../base/mango-hit-base-search';
import { VoucherService } from '../shared/voucher.service';
import { voucherStatusAction } from '../../../_models/enums/voucher.status.enum';
import { voucherInfoStatus, voucherInfoStatusAction } from '../../../_models/enums/voucher.info.status.enum';

enum StatusInfoDetail {
  DELETED = 0,
  NOT_RECEIVED = 1,
  RECEIVED = 2
}

enum StyleStatusInfoDetail {
  DELETED = 'color: #4CAF50;\n' ,

  NOT_RECEIVED =
    'color: rgb(127 107 202);\n' ,
  RECEIVED = 'color: #4CAF50;\n'
}


@Component({
  selector: 'app-voucher-info-detail',
  templateUrl: './voucher-info-detail.component.html',
  styleUrls: ['./voucher-info-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VoucherInfoDetailComponent extends MangoHitBaseSearch implements OnInit {

  moduleName = 'voucher-used-info';
  columns: ColumnFields[] = [];
  button: ButtonFields[] = [];
  statusOptions: SelectModel[] = [];
  typeSelectOptions: SelectModel[] = [];
  id?: number;

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
              protected apollo: Apollo) {
    super(formBuilder, router, apiService, utilsService, uiStateService,
      translateService, injector, activatedRoute, authoritiesService, dateServiceUtil, apollo);
    this.id = +this.activatedRoute.snapshot.params.id;
    this.searchForm = this.formBuilder.group({
      searchCode: [''],
      address: [''],
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
        columnDef: 'avatar', header: 'avatar',
        title: (e: any) => ``,
        cell: (e: any) => `${e.user?.avatar ? e.user?.avatar : ''}`,
        className: 'mat-column-banner  banner-image',
        columnType: ColumnTypes.IMG_NO_SECURE,
      },
      {
        columnDef: 'displayName', header: 'displayName',
        title: (e: any) => `${e.user?.display_name ? e.user?.display_name : ''}`,
        cell: (e: any) => `${e.user?.display_name ? e.user?.display_name : ''}`,
        className: 'voucher-title-size',
      },
      {
        columnDef: 'phoneNumber', header: 'phoneNumber',
        title: (e: any) => `${e.user?.username ? e.user?.username : ''}`,
        cell: (e: any) => `${e.user?.username ? e.user?.username : ''}`,
        className: '',
      },
      {
        columnDef: 'address', header: 'address',
        title: (e: any) => 'Ha Noi',
        cell: (e: any) => 'Ha Noi',
        className: '',
      },
      {
        columnDef: 'status', header: 'status',
        title: (e: any) => `${translateService.instant(voucherInfoStatusAction.getStatusLabel(e.status + ''))}`,
        cell: (e: any) => `${translateService.instant(voucherInfoStatusAction.getStatusLabel(e.status + ''))}`,
        columnType: ColumnTypes.STYLE_CSS,
        style: (e: any) => `${e.status === StatusInfoDetail.NOT_RECEIVED ? StyleStatusInfoDetail.NOT_RECEIVED : StyleStatusInfoDetail.RECEIVED}`,
      }

    );
    // this.button.push(
    //   {-
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
    const { searchCode } = this.searchForm.value;
    this.customFilterData(this.voucherService.GET_VOUCHER_INFO_DETAIL, {
      voucherId: this.id,
      searchCode: searchCode ? searchCode : null,
    });
  }

  delete(element: any) {
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


}
