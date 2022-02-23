import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../user-management/shared/user.service';
import {Apollo, gql} from 'apollo-angular';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/internal/operators';
import {VoucherService} from '../shared/voucher.service';
import {Location} from '@angular/common';
import {Voucher} from '../../../_models/voucher/voucher.model';
import {
    DateUtilService, UtilsService, DialogTypeEnum, FlatTreeNode, SelectModel, ApiService
} from '@next-solutions/next-solutions-base';
import {voucherStatusAction} from '../../../_models/enums/voucher.status.enum';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogConfig} from '@angular/material/dialog';
import {environment} from '../../../../environments/environment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpHeaders, HttpParams} from '@angular/common/http';


@Component({
    selector: 'app-voucher-detail',
    templateUrl: './voucher-detail.component.html',
    styleUrls: ['./voucher-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class VoucherDetailComponent implements OnInit {

    voucher$?: any;
    voucher: any;
    id?: number;
    safeImageUrl: SafeUrl | undefined;
    locationCodes: string[] = [];
    locationTree: FlatTreeNode[] = [];
    form?: FormGroup;
    customersSelect?: SelectModel[] = [];
    valueCustomers: string[] = [];
    image1 = '';
    image2 = '';
    image3 = '';

    constructor(private apollo: Apollo, private router: Router,
                private activatedRoute: ActivatedRoute, public voucherService: VoucherService,
                private location: Location, public dateUtilService: DateUtilService,
                protected utilsService: UtilsService, private sanitizer: DomSanitizer,
                protected translateService: TranslateService,
                protected apiService: ApiService,
                protected formBuilder: FormBuilder,) {
        this.id = +this.activatedRoute.snapshot.params.id;
    }

    ngOnInit(): void {

        const formData = new FormData();
        formData.append('id',this.activatedRoute.snapshot.params.id);
        this.apiService.post('/api/user/getProductId', formData,
            {
              headers: new HttpHeaders(),
            }, environment.SERVER_BOOK).subscribe((res:any) => {
                this.voucher = res.data;
                res.data.attachMents.forEach((item:any,index:any)=>{
                    if (index ===0){
                        this.image1 = item.url;
                    }
                    if (index ===1){
                        this.image2 = item.url;
                    }
                    if (index ===2){
                        this.image3 = item.url;
                    }
                })
        });

        this.form = this.formBuilder.group({
            address: [''],
            customers: ['']
        })


    }

    onBack() {
        this.router.navigate(['/voucher']).then();
    }

    addNewVoucher() {
        this.router.navigate(['/voucher/add']).then();
    }

    editVoucher() {
        this.router.navigate(['/voucher/edit/' + this.id]).then();
    }

    updateScrumb(event: any) {
        switch (event.label) {
            case 'menu.campaign.mstore.view':
                event.label = 'test';
        }
    }

    disableEditButton() {
        if (this.voucher && this.voucher.status !== 'Pending') {
            return true;
        }
        return false;
    }

    disableApproveButton() {
        if (this.voucher && this.voucher.status !== 'Pending') {
            return true;
        }
        return false;
    }

    disableShowDetailButton() {
        if (this.voucher && this.voucher.status !== 'Published') {
            return true;
        }
        return false;
    }


    approveVoucher(element: any) {
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
                this.voucherService.approveVoucher(element).subscribe(_ => {
                    this.router.navigate(['/voucher']).then();
                }, _ => {
                    this.utilsService.showErrorToarst('common.error');
                });
            }
        });
    }

    formatDate(event: any) {
        const hour = event.getHours().toString().length === 1 ? `0${event.getHours()}` : event.getHours();
        const min = event.getMinutes().toString().length === 1 ? `0${event.getMinutes()}` : event.getMinutes();
        return event.getDate() + '/' + parseInt(event.getMonth() + 1, 0) + '/' + event.getFullYear() + ' ' + hour + ':' + min;
    }

    viewInfoDetail() {
        if (this.id) {
            this.router.navigate(['/voucher/voucher-info-detail/' + this.id]).then();
        }
    }

    toLocationCode() {
        return this.locationCodes;
    }


}
