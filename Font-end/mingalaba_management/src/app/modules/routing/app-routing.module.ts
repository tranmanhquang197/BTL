import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LogoutComponent } from '../../logout/logout.component';
import { AuthoritiesResolverService } from '@next-solutions/next-solutions-base';
import { HomeComponent } from '../../components/home/home.component';
import { HomePageComponent } from '../../components/main-home/home-page/home-page.component';
import { VoucherManagementComponent } from '../../components/voucher-management/voucher-management.component';
import {ProductDetailComponent} from '../../components/product-detail/product-detail.component';
import {BillingDetailComponent} from '../../components/billing-detail/billing-detail.component';
import {ShoppingCartComponent} from '../../components/shopping-cart/shopping-cart.component';
import {SearchFormComponent} from '../../components/search-form/search-form.component';

const routes: Routes = [
  { path: '', component: VoucherManagementComponent },
  { path: 'home', component: HomeComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'billing-detail', component: BillingDetailComponent },
  { path: 'search-product/:name', component: SearchFormComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'dashboard', component: DashboardComponent,resolve: { me: AuthoritiesResolverService }},
  { path: 'logout', component: LogoutComponent},
  {
    path: 'user-management',
    loadChildren: () => import('../../components/user-management/user-management.module').then(m => m.UserManagementModule),
    data: {breadcrumb: 'menu.user-management'}
  },
  { path: 'voucher',
    loadChildren: () => import('../../components/voucher-management/voucher-management.modules').then(m => m.VoucherManagementModule),
    data: {breadcrumb: 'voucher'}
  },
  { path: 'evoucher',
    loadChildren: () => import('../../components/evocher/evoucher.modules').then(m => m.EvoucherModules),
    data: {breadcrumb: 'evoucher'}
  },
  { path: 'customer-care',
    loadChildren: () => import('../../components/customer-care/customer-care.modules').then(m => m.CustomerCareModules),
    data: {breadcrumb: 'customer.care'}
  },
  { path: 'users',
    loadChildren: () => import('../../components/users/users.modules').then(m => m.UsersModules),
    data: {breadcrumb: 'customer.care'}
  },
  { path: 'report-users',
    loadChildren: () => import('../../components/report-users/report-users.modules').then(m => m.reportUsersModules),
    data: {breadcrumb: 'report.user'}
  }




];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    onSameUrlNavigation: 'reload',
    // preloadingStrategy: PreloadAllModules,
  },
  ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
