import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {NgxPaginationModule} from 'ngx-pagination';
import {CookieService} from 'ngx-cookie-service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MultilanguagePanigator} from './_helpers/multilanguage.paginator';

import {AppComponent} from './app.component';
import {LoginComponent} from './shared/login/login.component';
import {AddEditUserComponent} from './components/user/add-edit-user/add-edit-user.component';
import {ListUserComponent} from './components/user/list-user/list-user.component';
import {ApiService} from './_services/api.service';
import {AuthenticationService} from './_services/authentication.service';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {NavService} from './_services/nav.service';
import {MenuListItemComponent} from './shared/menu-list-item/menu-list-item.component';
import {TopNavComponent} from './shared/top-nav/top-nav.component';
import {LogoutComponent} from './shared/logout/logout.component';
import {MaterialModule} from './modules/material.module';
import {ListRoleComponent} from './components/role/list-role/list-role.component';
import {ListMenuComponent} from './components/menu/list-menu/list-menu.component';
import {ListPermissionComponent} from './components/permission/list-permission/list-permission.component';
import {AddEditPermissionComponent} from './components/permission/add-edit-permission/add-edit-permission.component';
import {AddEditMenuComponent} from './components/menu/add-edit-menu/add-edit-menu.component';
import {AddEditRoleComponent} from './components/role/add-edit-role/add-edit-role.component';
import {AppRoutingModule} from './app-routing.module';
import {ListClientComponent} from './components/client/list-client/list-client.component';
import {AddEditClientComponent} from './components/client/add-edit-client/add-edit-client.component';
import {AddEditRolePermissionComponent} from './components/role/add-edit-role-permission/add-edit-role-permission.component';
import {AddRoleUserComponent} from './components/user/add-role-user/add-role-user.component';
import {PhoneValidation} from './validation/PhoneValidation';
import {StringValidation} from './validation/StringValidation';
import {NumberValidation} from './validation/NumberValidation';
import {DateValidation} from './validation/DateValidation';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FilterComponent} from '../filter/filter.component';
import {WINDOW_PROVIDERS} from './_services/window.providers';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {LoaderInterceptor, NextSolutionsModules} from '@next-solutions/next-solutions-base';
import {environment} from '../environments/environment';
import {ToastrModule} from 'ngx-toastr';
import {SharedModule} from './modules/shared.module';
import { TranslateLoaderFactoryHelper } from './_helpers/TranslateLoaderFactoryHelper';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    AddEditUserComponent,
    ListUserComponent,
    MenuListItemComponent,
    TopNavComponent,
    ListRoleComponent,
    ListMenuComponent,
    ListPermissionComponent,
    AddEditPermissionComponent,
    AddEditMenuComponent,
    AddEditRoleComponent,
    ListClientComponent,
    AddEditClientComponent,
    AddEditRolePermissionComponent,
    AddRoleUserComponent,
    FilterComponent,
  ],
  // Mấy ông mà gọi Modal là phải cho vào đây nhé @@
  entryComponents: [
    LoginComponent,
    AddEditUserComponent,
    AddEditRoleComponent,
    AddEditPermissionComponent,
    AddEditMenuComponent,
    AddEditClientComponent,
    AddEditRolePermissionComponent,
    AddRoleUserComponent,
  ],
  imports: [
    /*ONLY ONCE TIME*/
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NextSolutionsModules.forRoot({
      data: {
        BASE_AUTHORIZATION_URL: environment.BASE_URL,
        BASE_URL: environment.BASE_URL,
        PAGE_SIZE: environment.PAGE_SIZE,
        PAGE_SIZE_OPTIONS: environment.PAGE_SIZE_OPTIONS,
        API_DATE_FORMAT: environment.API_DATE_FORMAT,
        DIS_DATE_FORMAT: environment.DIS_DATE_FORMAT,
        DIALOG_LOGO: environment.DIALOG_LOGO
      }
    }),
    ToastrModule.forRoot(), // ToastrModule added
    TranslateModule.forRoot({
      defaultLanguage: environment.DEFAULT_LANGUAGE,
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLoaderFactoryHelper.forModule(),
        deps: [HttpClient],
      },
      isolate: false,
    }),
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: MatPaginatorIntl, useClass: MultilanguagePanigator},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    CookieService,
    LoginComponent,
    AuthenticationService,
    ApiService,
    NavService,
    WINDOW_PROVIDERS,
    PhoneValidation,
    StringValidation,
    NumberValidation,
    DateValidation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
