import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { UserService } from '../../user-management/shared/user.service';
import {Apollo, gql} from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { Location } from '@angular/common';
import {
  DateUtilService, UtilsService, DialogTypeEnum, FlatTreeNode, SelectModel,
} from '@next-solutions/next-solutions-base';
import { voucherStatusAction } from '../../../_models/enums/voucher.status.enum';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { evoucherStatusAction } from '../../../_models/enums/evoucher.status.enum';
import { VoucherService } from '../voucher.service';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-evoucher-detail',
  templateUrl: './evoucher-detail.component.html',
  styleUrls: ['./evoucher-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EvoucherDetailComponent implements OnInit {

  voucher$?: any;
  voucher: any;
  id?: number;
  safeImageUrl: SafeUrl | undefined;
  locationCodes: string[] = [];
  locationTree: FlatTreeNode[] = [];
  customersSelect?:SelectModel[] = [];
  form?: FormGroup;
  valueCustomers:string[] = [];

  constructor(private apollo: Apollo, private router: Router,
              private activatedRoute: ActivatedRoute, public voucherService: VoucherService,
              private location: Location, public dateUtilService: DateUtilService,
              protected utilsService: UtilsService, private sanitizer: DomSanitizer,
              protected translateService: TranslateService,
              protected formBuilder: FormBuilder) {
    this.id = +this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      address: [''],
      customers:['']
    })

    this.apollo.watchQuery<any>({
      query: gql`
            query{
                getAddress {
                  value
                  displayValue
                  children {
                     value
                     displayValue
                     children {
                       value
                       displayValue
                  }
                }
              }
            }
        `,
    }).valueChanges.subscribe(({data}) => {
      this.convertTree(data.getAddress);
    });

    this.voucher$ = this.apollo.watchQuery<any>({
      query: this.voucherService.GET_VOUCHER_BY_ID,
      variables: {
        voucherId: Number(this.id),
      },
    }).valueChanges.pipe(
      map((next: any) => {
        this.voucher = { ...next.data.getDetailVoucherById };
        this.voucher.from_date = this.formatDate(new Date(this.voucher.from_date));
        this.voucher.to_date = this.formatDate(new Date(this.voucher.to_date));

        if (this.voucher?.voucher_distribute?.customer) {
          this.customersSelect = [];
          for (const customer of this.voucher?.voucher_distribute?.customer) {
            this.valueCustomers.push(customer.username);
            this.customersSelect.push(new SelectModel(customer.username,customer.display_name+' - '+customer.username,true))
          }
          this.form?.get('customers')?.setValue(this.valueCustomers);
        }

        let file = { ...this.voucher.file };
        if (!file.file_url) {
          this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(environment.NO_IMAGE);
          file.file_url = this.safeImageUrl;
          this.voucher.file = file;
        } else {
          this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(file.file_url);
        }
        this.voucher.hobbies = [];
        for (const hobby of this.voucher.voucher_distribute?.hobbies) {
          this.voucher.hobbies.push(' ' + hobby.name);
        }
        this.voucher.townships = [];
        for (const township of this.voucher.voucher_distribute?.township) {
          this.voucher.townships.push(' ' + township.name);
        }
        this.voucher.status = this.translateService.instant(evoucherStatusAction.getStatusLabel(this.voucher.status + ''));

        const townshipIds = [];
        if (this.voucher?.voucher_distribute?.township) {
          for (const township of this.voucher?.voucher_distribute?.township) {
            townshipIds.push(township.id);
          }
        }
        townshipIds.forEach((item:any)=>{
          this.locationCodes = [...this.locationCodes,item];
        })
        console.log('towship : ',this.locationCodes);

        return this.voucher ? this.voucher : null;
      }),
    );


  }

  onBack() {
    this.router.navigate(['/evoucher']).then();
  }

  addNewVoucher() {
    this.router.navigate(['/evoucher/add']).then();
  }

  editVoucher() {
    this.router.navigate(['/evoucher/edit/' + this.id]).then();
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

  disableApproveButton(){
    if (this.voucher && this.voucher.status !== 'Pending') {
      return true;
    }
    return false;
  }

  disableShowDetailButton(){
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

  convertTree(data:any){
    let listItemC1: any[];
    listItemC1 = [];
    let listItem2: any[];
    listItem2 = [];
    let listItemC3: any[];
    listItemC3 = [];
    let listItemC4: any[];
    listItemC4 = [];
    data.forEach((item:any)=>{
      if(item.children.length > 0){
        item.children.forEach(((i:any)=>{
          if(i.children.length > 0){
            listItemC3 = [];
            i.children.forEach((value:any)=>{
              listItemC3.push(
                  {
                    value:value.value,
                    displayValue:  value.displayValue,
                    children:[]
                  }
              )
            })

          }
          listItem2.push(
              {
                value:i.value,
                displayValue:  i.displayValue,
                children:listItemC3
              }
          )
        }))
      }

      listItemC1.push({
        value:item.value,
        displayValue:  item.displayValue,
        children:listItem2
      })
    })
    listItemC1.forEach((i:any)=>{
      this.locationTree = [...this.locationTree,i];
    })

  }

  toLocationCode() {
    return this.locationCodes;
  }


}
