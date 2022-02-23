import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { VoucherService } from '../voucher-management/shared/voucher.service';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from '@next-solutions/next-solutions-base';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Ng5SliderModule } from 'ng5-slider';
import { CustomerCareComponent } from './customer-care.component';


export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/customer-care/', suffix: '.json' },
    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}

const routes: Routes = [
  {
    pathMatch: 'full',
    path: '',
    component: CustomerCareComponent,
  }

];

@NgModule({
  declarations: [CustomerCareComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng5SliderModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  providers: [VoucherService],
})
export class CustomerCareModules {
}
