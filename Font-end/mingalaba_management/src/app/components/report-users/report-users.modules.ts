import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../modules/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {VoucherService} from '../voucher-management/shared/voucher.service';
import {HttpClient} from '@angular/common/http';
import {MultiTranslateHttpLoader} from '@next-solutions/next-solutions-base';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {Ng5SliderModule} from 'ng5-slider';
import {ReportUsersComponent} from './report-users.component';
import {reportUsersService} from './report-users.service';
import {ReportUserDetailsComponent} from './report-user-details/report-user-details.component';
import {DialogImageComponent} from './report-user-details/dialog-image/dialog-image.component';


export function createTranslateLoader(http: HttpClient) {
        return new MultiTranslateHttpLoader(http, [
                {prefix: './assets/i18n/report-users/', suffix: '.json'},
                {prefix: './assets/i18n/', suffix: '.json'},
        ]);
}

const routes: Routes = [
        {
                pathMatch: 'full',
                path: '',
                component: ReportUsersComponent,
        },
        {
                path: 'details/:id',
                component: ReportUserDetailsComponent,
                data: {breadcrumb: 'report-users.heading.detail'},
        },

];

@NgModule({
        declarations: [ReportUsersComponent,ReportUserDetailsComponent,DialogImageComponent],
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
        providers: [reportUsersService],
})
export class reportUsersModules {
}
