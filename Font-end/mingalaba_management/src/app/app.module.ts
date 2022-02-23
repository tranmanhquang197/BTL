import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './_services/authentication.service';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { NavService } from './_services/nav.service';
import { MenuListItemComponent } from './_helpers/menu-list-item/menu-list-item.component';
import { TopNavComponent } from './_helpers/top-nav/top-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutComponent } from './logout/logout.component';
import { AppRoutingModule } from './modules/routing/app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { JsogService } from 'jsog-typescript';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { GlobalErrorHandler } from './_services/errorHandle/global-error-handler';
import { LoaderInterceptor, NextSolutionsModules } from '@next-solutions/next-solutions-base';
import { SharedService } from './_services/shared.service';
import { factories, service as PBIService } from 'powerbi-client';
import { SharedModule } from './modules/shared.module';
import { environment } from '../environments/environment';
import { TranslateLoaderFactoryHelper } from './_helpers/TranslateLoaderFactoryHelper';
import { GraphQLModule } from './graphql.module';
import { HomeComponent } from './components/home/home.component';
import {AuthService} from './_services/auth.service';
import {SubscriptionService} from "./_services/subscription.service";
import {ProductDetailComponent} from "./components/product-detail/product-detail.component";
import {BillingDetailComponent} from "./components/billing-detail/billing-detail.component";
import {ShoppingCartComponent} from "./components/shopping-cart/shopping-cart.component";
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {SearchFormComponent} from "./components/search-form/search-form.component";


export function powerBiServiceFactory() {
  return new PBIService.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
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
    CdkStepperModule,
    CdkTableModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    MenuListItemComponent,
    TopNavComponent,
    DashboardComponent,
    HomeComponent,
    ProductDetailComponent,
    BillingDetailComponent,
    ShoppingCartComponent,
    HeaderComponent,
    SearchFormComponent,
    FooterComponent
  ],
  // Mấy ông mà gọi Modal là phải cho vào đây nhé @@ => update lên ivy thì không cần bắt buộc khai báo nữa
  entryComponents: [
    LoginComponent,
  ],
  imports: [
    /*ONLY ONCE TIME*/
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NextSolutionsModules.forRoot({
      data: {
        BASE_URL: environment.BASE_URL,
        BASE_AUTHORIZATION_URL: environment.BASE_AUTHORIZATION_URL,
        PAGE_SIZE: environment.PAGE_SIZE,
        PAGE_SIZE_OPTIONS: environment.PAGE_SIZE_OPTIONS,
        API_DATE_FORMAT: environment.API_DATE_FORMAT,
        DIS_DATE_FORMAT: environment.DIS_DATE_FORMAT,
        DIALOG_LOGO: '' /*environment.DIALOG_LOGO*/,
      },
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
    GraphQLModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: 'PowerBIService', useFactory: powerBiServiceFactory }, // To inject a instance of pbi client library
    JsogService,
    DatePipe,
    CookieService,
    LoginComponent,
    AuthenticationService,
    NavService,
    SharedService,
    AuthService,
    SubscriptionService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppModule {
}

