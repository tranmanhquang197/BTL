import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { ProductComponent } from './product/product.component';
import { NewsComponent } from './news/news.component';
import { JobsComponent } from './jobs/jobs.component';


@NgModule({
  declarations: [HomePageComponent, ProductComponent, NewsComponent, JobsComponent,],
  imports: [
    CommonModule
  ]
})
export class MainHomeModule { }
