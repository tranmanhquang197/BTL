import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { AuthoritiesService, BaseTableLayout } from '@next-solutions/next-solutions-base';
import { ActivatedRoute } from '@angular/router';

// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {stringify} from "querystring";

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

export interface Product {
  id?:number,
  product: string;
  productype?:string;
  name: string;
  price: number;
  quantity: number;
  total:number;
  action:string
}

const ELEMENT_DATA: Product[] = [
  {product: 'number', name: 'Hydrogen', price: 1.0079, quantity: 2,total:200000,action:''},

];

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShoppingCartComponent extends BaseTableLayout implements OnInit {

  searchForm?: FormGroup;
  lenthShoppingCart?:number;
  displayedColumns: string[] = ['product', 'name', 'price', 'quantity','total','action'];
  dataSource = ELEMENT_DATA;
  total= 0;
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected authoritiesService: AuthoritiesService,
    protected formBuilder: FormBuilder,
  ) {
    super(activatedRoute, authoritiesService)
  }

  ngOnInit(): void {

    const localProduct = window.localStorage.getItem('shopping-cart');
    if(localProduct) {
      const parse = JSON.parse(localProduct);
      this.lenthShoppingCart  = parse.length;
      this.dataSource = parse;
      this.totalPrice(parse)

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

  totalPrice(listProduct:any){
    this.total = 0;
    listProduct.forEach((item:any)=>{
      this.total += item.price;
    })
  }

  minus(index:number){
    const localProduct = window.localStorage.getItem('shopping-cart');
    if(localProduct) {
      const parse = JSON.parse(localProduct);
      parse.filter((item:any,i = index)=>{
        if (i === index && item.quantity >1 ){
          item.quantity -= 1;
        }
      })
      this.dataSource = parse;
      this.totalPrice(parse);
      window.localStorage.setItem('shopping-cart',JSON.stringify(parse));
    }
  }

  plus(index:number){
    const localProduct = window.localStorage.getItem('shopping-cart');
    if(localProduct) {
      const parse = JSON.parse(localProduct);
      parse.filter((item:any,i = index)=>{
        if (i === index ){
          item.quantity += 1;
        }
      })
      this.dataSource = parse;
      this.totalPrice(parse);
      window.localStorage.setItem('shopping-cart',JSON.stringify(parse));
    }
  }

  delete(index:any){
    const localProduct = window.localStorage.getItem('shopping-cart');
    if(localProduct) {
      const parse = JSON.parse(localProduct);
      const data =  parse.filter((item:any,i = index)=>{
        return i!==index;
      })
      this.dataSource = data;
      this.lenthShoppingCart = data.length;
      this.totalPrice(data);
      window.localStorage.setItem('shopping-cart',JSON.stringify(data));
    }
  }

}
