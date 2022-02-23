import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  ApiService,
  AuthoritiesService,
  BaseTableLayout,
  DialogTypeEnum,
  UtilsService
} from '@next-solutions/next-solutions-base';
import {ActivatedRoute, Router} from '@angular/router';

// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogConfig} from '@angular/material/dialog';
import {HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-billing-detail',
  templateUrl: './billing-detail.component.html',
  styleUrls: ['./billing-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BillingDetailComponent extends BaseTableLayout implements OnInit {

  searchForm?: FormGroup;
  listProduct = [];
  lenthShoppingCart = 0;
  total = 0;
  product?:any[] = [];
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected authoritiesService: AuthoritiesService,
    protected translateService: TranslateService,
    protected apiService: ApiService,
    protected router: Router,
    protected utilsService: UtilsService,
    protected formBuilder: FormBuilder,
  ) {
    super(activatedRoute, authoritiesService)
  }

  ngOnInit(): void {
    const localProduct = window.localStorage.getItem('shopping-cart');
    if(localProduct) {
      const parse = JSON.parse(localProduct);
      this.lenthShoppingCart  = parse.length;
      this.listProduct = parse;
      this.total = 0;
      parse.forEach((item:any)=>{
        this.total += item.price;
      })

    }else{
      this.lenthShoppingCart  = 0;
    }

    this.searchForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      mail: [''],
      address:[''],
      provice:[''],
      district:[''],
      township:[''],
    });

  }

  order(){

    const user = window.sessionStorage.getItem('userName');
    if(user){
      const strOk = this.translateService.instant('common.OK');
      const strCancel = this.translateService.instant('common.Cancel');
      const dialogConfig: MatDialogConfig<any> = {
        data: {
          customClass: 'reject_reason_dialog',
          msg: this.translateService.instant('common.action*.4'),
          msgDetail: this.translateService.instant('Bạn có muốn đặt đơn hàng ?'),
          type: DialogTypeEnum.CONFIRM,
          btnOKString: strOk,
          btnCancelString: strCancel,
        },
      };

      this.utilsService.showConfirmDialog('Bạn có muốn đặt đơn hàng ?', [],
          '', [])
          .afterClosed().subscribe(next => {
        if (next && next.value === 1) {

          const userId = window.sessionStorage.getItem('userId');
          const name = window.sessionStorage.getItem('userName');
          const productOrder = window.localStorage.getItem('shopping-cart');
          let parse = null;
          if (productOrder){
             parse = JSON.parse(productOrder);
          }
          const {phone,mail,address} = this.searchForm?.value;

          parse.forEach((item:any)=>{
            this.product = [...this.product,{
              productId:item.id,
              productName:item.name,
              image:item.product,
              count:item.quantity,
              price:item.total
            }]
          })



          const payload = {
            phone,
            email:mail,
            address,
            userId,
            name,
            totalPrice:this.total,
            orderDetail:this.product
          };

          this.apiService.post('/api/user/createOrder', payload,
              {
                headers: new HttpHeaders(),
              }, environment.SERVER_BOOK)
              .subscribe(res => {
                this.utilsService.onSuccessFunc('Bạn đã đặt thành công đơn hàng !');
                window.localStorage.removeItem('shopping-cart');
                this.router.navigate(['/home']).then();
              });

        }
      });
    }
    else {
      this.utilsService.showErrorToarst('Bạn phải login tài khoản để đặt đơn');
    }


  }

}
