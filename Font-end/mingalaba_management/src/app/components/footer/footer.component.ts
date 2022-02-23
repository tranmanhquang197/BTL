import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthoritiesService, BaseTableLayout, UtilsService} from '@next-solutions/next-solutions-base';
import {ActivatedRoute, Router} from '@angular/router';

// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';

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
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent extends BaseTableLayout implements OnInit {




  constructor(
    protected activatedRoute: ActivatedRoute,
    protected utilsService: UtilsService,
    protected authoritiesService: AuthoritiesService,
    protected router: Router
  ) {
    super(activatedRoute, authoritiesService)
  }

  ngOnInit(): void {
  }

}
