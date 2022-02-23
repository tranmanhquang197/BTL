import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import {SharedModule} from '../../modules/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {UserService} from './shared/user.service';
import {HttpClient} from '@angular/common/http';
import {MultiTranslateHttpLoader} from '@next-solutions/next-solutions-base';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { UserDetailComponent } from './user-detail/user-detail.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: './assets/i18n/user-management/',suffix: '.json'},
    {prefix: './assets/i18n/',suffix: '.json'},
  ])
}
const routes: Routes = [
  {
    pathMatch: 'full',
    path: '',
    component: UserManagementComponent
  },
  {
    path: 'view/:id',
    component: UserDetailComponent
  }
];

@NgModule({
  declarations: [UserManagementComponent, UserDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [UserService]
})
export class UserManagementModule { }
