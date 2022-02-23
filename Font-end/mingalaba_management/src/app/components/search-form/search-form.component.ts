import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService, AuthoritiesService, BaseTableLayout, Page, UtilsService} from '@next-solutions/next-solutions-base';
import {ActivatedRoute} from '@angular/router';

// import Swiper core and required modules
import SwiperCore, {Autoplay, Pagination, Navigation} from 'swiper/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Product} from '../home/home.component';
import {HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchFormComponent extends BaseTableLayout implements OnInit {

    searchForm?: FormGroup;
    lenthShoppingCart = 0;
    total = 0;
    listProductSearch: Product[] = [];

    lengShopping = 0;


    constructor(
        protected activatedRoute: ActivatedRoute,
        protected authoritiesService: AuthoritiesService,
        protected utilsService: UtilsService,
        protected apiService: ApiService,
        protected formBuilder: FormBuilder,
    ) {
        super(activatedRoute, authoritiesService)
    }

    ngOnInit(): void {
        this._fillDataByPostMethod('/api/user/searchProduct', {params: new HttpParams()}, environment.SERVER_BOOK);
    }

    addToCart(addToCart: any) {
        const localProduct = window.localStorage.getItem('shopping-cart');
        if (localProduct) {
            const parse = JSON.parse(localProduct);
            const check = parse.find((item: any) => {
                return item.id === addToCart.id
            })
            if (!check) {
                parse.push(
                    addToCart
                )
                this.lengShopping = parse.length;
                window.localStorage.setItem('shopping-cart', JSON.stringify(parse));
                this.utilsService.onSuccessFunc('you have successfully added');
            } else {
                this.utilsService.showErrorToarst('Your product is already in the cart');
            }

        } else {
            window.localStorage.setItem('shopping-cart', JSON.stringify([addToCart]));
            this.lengShopping = 1;
            this.utilsService.onSuccessFunc('you have successfully added');
        }
    }

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
    if (!params.keys().includes('pageNumber')) {

      params = params.append('name', this.activatedRoute.snapshot.params.name);
      params = params.append('productType', '');
      params = params.append('fromDate', '');
      params = params.append('toDate', '');
      params = params.append('pageNumber', '0');
      params = params.append('pageSize', '10');


    }
    return params;
  }

  private afterFillData = (datas: Page | any) => {
    const data = datas.data;
    data.content.forEach((item:any)=>{
        this.listProductSearch = [...this.listProductSearch,
            {
                id: item.id,
                product: item.url,
                productype: item.product_types,
                name: item.userName,
                price: item.price,
                quantity: 1,
                total: item.product_types,
                action: 'string'
            }
        ]


    })

  };


}
