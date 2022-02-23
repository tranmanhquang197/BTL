import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthoritiesService, BaseTableLayout, UtilsService} from '@next-solutions/next-solutions-base';
import {ActivatedRoute, Router} from '@angular/router';

// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import {FormBuilder, FormGroup} from '@angular/forms';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

export interface Product {
  id:number,
  product: string;
  productype?:string;
  name: string;
  price: number;
  quantity: number;
  total:number;
  action:string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent extends BaseTableLayout implements OnInit {


  @Input() add?:number;
  searchForm?:FormGroup;
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected utilsService: UtilsService,
    private fb: FormBuilder,
    protected authoritiesService: AuthoritiesService,
    protected router: Router
  ) {
    super(activatedRoute, authoritiesService)
  }

  ngOnInit(): void {

    this.searchForm = this.fb.group({
      name:['']
    })
    if(this.add){
      this.add = this.add;
    }else{
      const length =  window.localStorage.getItem('shopping-cart')
      if (length){
        this.add =  JSON.parse(length).length;
      }
      else{
        this.add = 0;
      }
    }
  }

  click(){
    this.router.navigate(['/product-detail']).then();
  }

  onSubmit(){
    console.log('Vào đây');
    const  { name } = this.searchForm?.value;
    this.router.navigate(['/search-product/'+name]).then();
  }

}
