import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService, AuthoritiesService, BaseTableLayout, UtilsService} from '@next-solutions/next-solutions-base';
import {ActivatedRoute} from '@angular/router';

// import Swiper core and required modules
import SwiperCore, {Autoplay, Pagination, Navigation} from 'swiper/core';
import {Product} from "../home/home.component";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProductDetailComponent extends BaseTableLayout implements OnInit {


    id?: number;
    product?: any;
    lengShopping = 0;
    value = 1;
    urlImage = '';

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected authoritiesService: AuthoritiesService,
        protected apiService: ApiService,
        protected utilsService: UtilsService,
    ) {
        super(activatedRoute, authoritiesService);
        this.id = +this.activatedRoute.snapshot.params.id;

    }

    ngOnInit(): void {


        const formData = new FormData();
        formData.append('id', this.activatedRoute.snapshot.params.id);
        this.apiService.post('/api/user/getProductId', formData,
            {
                headers: new HttpHeaders(),
            }, environment.SERVER_BOOK).subscribe((res: any) => {
            this.product = res.data;
            this.urlImage = this.product?.attachMents[0]?.url;
        });

    }

    addShoppingCart(addToCart: any) {
        const localProduct = window.localStorage.getItem('shopping-cart');
        addToCart.quantity = this.value;
        if (localProduct) {
            const parse = JSON.parse(localProduct);
            const check = parse.find((item: any) => {
                return item.id === addToCart.id
            })
            if (!check) {
                parse.push({
                        product: addToCart?.attachMents[0]?.url,
                        name: addToCart?.name,
                        price: addToCart?.price,
                        quantity: this.value,
                        total: addToCart?.price *this.value,
                        action: ''
                    }
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

    minus() {
        if (this.value > 1) {
            this.value -= 1;
        }

    }

    plus() {
        this.value += 1;
    }

    setUrl(url: any) {
        this.urlImage = url;
    }

}
