import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { VoucherService } from '../voucher-management/shared/voucher.service';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from '@next-solutions/next-solutions-base';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Ng5SliderModule } from 'ng5-slider';
import {UsersComponent} from './users.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UsersService} from './users.service';


export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/users/', suffix: '.json' },
    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}

const routes: Routes = [
  {
    pathMatch: 'full',
    path: '',
    component: UsersComponent,
  },
  {
    path: 'user-detail/:id',
    component: UserDetailComponent,
    data: { breadcrumb: 'users.heading.detail' },
  }

];

@NgModule({
  declarations: [UsersComponent,UserDetailComponent],
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
  providers: [UsersService],
})
export class UsersModules {
}
