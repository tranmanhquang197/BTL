import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { VoucherService } from '../voucher-management/shared/voucher.service';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from '@next-solutions/next-solutions-base';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { VoucherManagementComponent } from './voucher-management.component';
import { AddOrEditVoucherComponent } from './a-e-voucher/add-or-edit-voucher.component';
import { Ng5SliderModule } from 'ng5-slider';
import { VoucherDetailComponent } from './voucher-detail/voucher-detail.component';
import { VoucherInfoDetailComponent } from './voucher-info-detail/voucher-info-detail.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/voucher/', suffix: '.json' },
    { prefix: './assets/i18n/voucher-used-info/', suffix: '.json' },

    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}

const routes: Routes = [
  {
    pathMatch: 'full',
    path: '',
    component: VoucherManagementComponent,
  },
  {
    path: 'view/:id',
    component: VoucherManagementComponent,
  }, {
    path: 'add',
    component: AddOrEditVoucherComponent,
    data: { breadcrumb: 'voucher-management.heading.addOrEdit' },
  },
  {
    path: 'edit/:id',
    component: AddOrEditVoucherComponent,
    data: { breadcrumb: 'voucher-management.heading.addOrEdit' },
  }, {
    path: 'voucher-detail/:id',
    component: VoucherDetailComponent,
    data: { breadcrumb: 'voucher-management.heading.detail' },
  }, {
    path:'voucher-info-detail/:id',
    component:VoucherInfoDetailComponent,
    data: { breadcrumb: 'voucher-management.heading.detail' },

  },

];

@NgModule({
  declarations: [VoucherManagementComponent, AddOrEditVoucherComponent, VoucherDetailComponent,VoucherInfoDetailComponent],
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
export class VoucherManagementModule {
}
