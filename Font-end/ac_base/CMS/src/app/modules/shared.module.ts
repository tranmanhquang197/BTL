import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileSaverModule } from 'ngx-filesaver';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { NextSolutionsModules, SingletonTranslateService, UtilsService } from '@next-solutions/next-solutions-base';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FileSaverModule,
    FlexLayoutModule,
    MaterialModule,
    NextSolutionsModules,
    TranslateModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FileSaverModule,
    FlexLayoutModule,
    MaterialModule,
    NextSolutionsModules,
  ],
  providers: [UtilsService],
})
export class SharedModule {
  constructor(private translate: TranslateService, protected singletonTranslateService: SingletonTranslateService) {
    if (!sessionStorage.getItem('lang' + environment.CLIENT_ID) || sessionStorage.getItem('lang' + environment.CLIENT_ID) === '') {
      sessionStorage.setItem('lang' + environment.CLIENT_ID, environment.DEFAULT_LANGUAGE);
      translate.setDefaultLang(environment.DEFAULT_LANGUAGE);
      singletonTranslateService.currentLanguage.next(environment.DEFAULT_LANGUAGE);
    } else {
      singletonTranslateService.currentLanguage.next('' + sessionStorage.getItem('lang' + environment.CLIENT_ID));
    }
    singletonTranslateService.currentLanguage$.subscribe((lang: string) => {
      this.translate.use(lang);
    });
  }
}
