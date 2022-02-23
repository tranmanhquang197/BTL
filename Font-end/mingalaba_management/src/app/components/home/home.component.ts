import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService, AuthoritiesService, BaseTableLayout, Page, UtilsService} from '@next-solutions/next-solutions-base';
import {ActivatedRoute, Router} from '@angular/router';

// import Swiper core and required modules
import SwiperCore, {Autoplay, Pagination, Navigation} from 'swiper/core';
import {HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

SwiperCore.use([Autoplay, Pagination, Navigation]);

export interface Product {
    id: number,
    product: string;
    productype?: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    action: string
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent extends BaseTableLayout implements OnInit {

    listProductSearch: Product[] = [];
    listProduct: Product[] = [
        {
            id: 1,
            product: 'http://lazeapostolski.com/sophia-ecommerce/assets/images/product/small/headphone2/headphone1.png',
            productype: 'Head phone',
            name: 'Solo head',
            price: 200000,
            quantity: 1,
            total: 2000000,
            action: 'string'
        },
        {
            id: 2,
            product: 'http://lazeapostolski.com/sophia-ecommerce/assets/images/product/small/phone4/phone1.png',
            productype: 'Smart phone',
            name: 'LG g1',
            price: 300000,
            quantity: 1,
            total: 3000000,
            action: 'string'
        },
        {
            id: 3,
            product: 'http://lazeapostolski.com/sophia-ecommerce/assets/images/product/small/phone5/phone1.png',
            productype: 'Head phone',
            name: 'Solo head',
            price: 200000,
            quantity: 1,
            total: 4000000,
            action: 'string'
        },
        {
            id: 4,
            product: 'http://lazeapostolski.com/sophia-ecommerce/assets/images/product/small/photocamera1/Photocamera1.png',
            productype: 'Camera',
            name: 'Sony HD200',
            price: 5000000,
            quantity: 1,
            total: 200000,
            action: 'string'
        },
        {
            id: 5,
            product: 'http://lazeapostolski.com/sophia-ecommerce/assets/images/product/small/photocamera5/Photocamera1.png',
            productype: 'Camera',
            name: 'Classic E50000',
            price: 6000000,
            quantity: 1,
            total: 200000,
            action: 'string'
        }
    ]

    lengShopping = 0;


    constructor(
        protected activatedRoute: ActivatedRoute,
        protected utilsService: UtilsService,
        protected authoritiesService: AuthoritiesService,
        protected apiService: ApiService,
        protected router: Router
    ) {
        super(activatedRoute, authoritiesService)
    }

    ngOnInit(): void {
        console.log('Vào đây');
        const length = window.localStorage.getItem('shopping-cart')
        if (length) {
            this.lengShopping = JSON.parse(length).length;
        }
        this._fillDataByPostMethod('/api/user/searchProduct', {params: new HttpParams()}, environment.SERVER_BOOK);

    }

    click() {
        this.router.navigate(['/product-detail']).then();
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
        if (!params.keys().includes('pageNumber')) {

            params = params.append('name', '');
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
        data.content.forEach((item: any) => {
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
