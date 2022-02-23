import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from '@next-solutions/next-solutions-base';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Ng5SliderModule } from 'ng5-slider';
import { EvoucherComponent } from './evoucher.component';
import { EvoucherDetailComponent } from './evoucher-detail/evoucher-detail.component';
import { EvoucherUsedInfoComponent } from './evoucher-used-info/evoucher-used-info.component';
import { VoucherService } from './voucher.service';
import { AddEditEvoucherComponent } from './add-edit-evoucher/add-edit-evoucher.component';


export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/evoucher/', suffix: '.json' },
    { prefix: './assets/i18n/evoucher-used-info/', suffix: '.json' },
    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}

const routes: Routes = [
  {
    pathMatch: 'full',
    path: '',
    component: EvoucherComponent,
  },
  // {
  //   path: 'view/:id',
  //   component: VoucherManagementComponent,
  // },
  {
    path: 'add',
    component: AddEditEvoucherComponent,
    data: { breadcrumb: 'evoucher.heading.addOrEdit' },
  },
  {
    path: 'edit/:id',
    component: AddEditEvoucherComponent,
    data: { breadcrumb: 'evoucher.heading.addOrEdit' },
  },

  {
    path: 'evoucher-detail/:id',
    component: EvoucherDetailComponent,
    data: { breadcrumb: 'evoucher.heading.detail' },
  }
  , {
    path: 'evoucher-user-info/:id',
    component: EvoucherUsedInfoComponent,
    data: { breadcrumb: 'evoucher.heading.detail' },
  },

];

@NgModule({
  declarations: [EvoucherComponent, EvoucherDetailComponent, EvoucherUsedInfoComponent, AddEditEvoucherComponent],
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
export class EvoucherModules {
}
