import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { UserService } from '../../user-management/shared/user.service';
import {Apollo, gql} from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { Location } from '@angular/common';
import {
  DateUtilService, UtilsService, DialogTypeEnum, FlatTreeNode, SelectModel, ApiService
} from '@next-solutions/next-solutions-base';
import { voucherStatusAction } from '../../../_models/enums/voucher.status.enum';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { evoucherStatusAction } from '../../../_models/enums/evoucher.status.enum';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UsersService} from '../users.service';
import {HttpHeaders} from '@angular/common/http';



@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserDetailComponent implements OnInit {

  // voucher$?: any;
  users: any;
  id?: number;
  safeImageUrl: SafeUrl | undefined;
  locationCodes: string[] = [];
  locationTree: FlatTreeNode[] = [];
  customersSelect?:SelectModel[] = [];
  form?: FormGroup;
  valueCustomers:string[] = [];
  user?:any;

  constructor(private apollo: Apollo, private router: Router,
              private activatedRoute: ActivatedRoute, public usersService: UsersService,
              private location: Location, public dateUtilService: DateUtilService,
              protected utilsService: UtilsService, private sanitizer: DomSanitizer,
              protected translateService: TranslateService,
              protected apiService: ApiService,
              protected formBuilder: FormBuilder) {
    this.id = +this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      address: [''],
      customers:['']
    })


    const formData = new FormData();
    formData.append('id',this.activatedRoute.snapshot.params.id);
    this.apiService.post('/api/user/getUserId', formData,
        {
          headers: new HttpHeaders(),
        }, environment.SERVER_BOOK).subscribe((res:any) => {
      this.user = res.data;
      this.user.image = this.user.image ? this.user.image: 'https://www.pngfind.com/pngs/m/470-4703547_icon-user-icon-hd-png-download.png';
      // res.data.attachMents.forEach((item:any,index:any)=>{
      //   if (index ===0){
      //     this.image1 = item.url;
      //   }
      //   if (index ===1){
      //     this.image2 = item.url;
      //   }
      //   if (index ===2){
      //     this.image3 = item.url;
      //   }
      // })
    });



  }


  viewInfoDetail() {
    if (this.id) {
      this.router.navigate(['/voucher/voucher-info-detail/' + this.id]).then();
    }
  }



  toLocationCode() {
    return this.locationCodes;
  }

  convertAvater(avatar:any){
    const listUrl = avatar.split('?width');
    if (!listUrl[1]){
      avatar += '?width=96&height=96'
    }
    return avatar;
  }




}
