import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {FileSaverModule} from 'ngx-filesaver';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from './material.module';
import {CommonModule} from '@angular/common';
import {NextSolutionsModules, SingletonTranslateService, UtilsService} from '@next-solutions/next-solutions-base';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {environment} from '../../environments/environment';
import {NsInputViewComponent} from '../base/ns-input-view/ns-input-view.component';
import {NsInputViewHorizontalComponent} from '../base/ns-input-view/ns-input-view-horizontal.component';
import {NsImageViewComponent} from '../base/ns-image-view.component';
import {NsUploadFileComponent} from '../base/ns-upload/ns-upload-file.component';
import {DialogFooterComponent} from '../base/dialog-footer.component';
import {BaseHeaderComponent} from '../base/base-header.component';
import {NsDownloadViewComponent} from '../base/ns-download-view.component';
import {DialogHeaderComponent} from '../base/dialog-header.component';
import {NsQuillEditorComponent} from '../base/ns-quill-editor';
import {QuillModule} from 'ngx-quill';
import {NsDialogChooseComponent} from '../base/ns-dialog-choose/ns-dialog-choose.component';
import {DialogImportFileComponent} from '../base/ns-upload/dialog-import-file.component';
import { Ng5SliderModule } from 'ng5-slider';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {NsMultiSelectSeachApiAutocompleteComponent} from '../base/ns-multi-select-seach-api-autocomplete.component';
import {NsCounterInputNewsComponent} from '../base/ns-counter-input-news.component';
import {NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular-material-components/moment-adapter';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzImageModule} from 'ng-zorro-antd/image';
import { SwiperModule } from 'swiper/angular';
// import {NsMultiSelectSeachApiAutocompleteComponent} from '../base/ns-multi-select-seach-api-autocomplete.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';

// export const MOMENT_DATETIME_WITH_SECONDS_FORMAT = 'YYYY-MM-DD HH:mm:ss';
// // If using Moment
// const CUSTOM_MOMENT_FORMATS: NgxMatDateFormats = {
//   parse: {
//     dateInput: MOMENT_DATETIME_WITH_SECONDS_FORMAT,
//   },
//   display: {
//     dateInput: MOMENT_DATETIME_WITH_SECONDS_FORMAT,
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

const INTL_DATE_INPUT_FORMAT = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second :'2-digit',
};

const MAT_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: INTL_DATE_INPUT_FORMAT,
  },
  display: {
    dateInput: INTL_DATE_INPUT_FORMAT,
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@NgModule({
  declarations: [
    NsInputViewComponent,
    NsInputViewHorizontalComponent,
    NsImageViewComponent,
    NsUploadFileComponent,
    DialogFooterComponent,
    BaseHeaderComponent,
    NsCounterInputNewsComponent,
    NsDownloadViewComponent,
    DialogHeaderComponent,
    NsQuillEditorComponent,
    NsDialogChooseComponent,
    DialogImportFileComponent,
    NsMultiSelectSeachApiAutocompleteComponent,

  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    SwiperModule,
    FileSaverModule,
    FlexLayoutModule,
    MaterialModule,
    NextSolutionsModules,
    Ng5SliderModule,
    TranslateModule,
    NzButtonModule,
    NzImageModule,
    NzUploadModule,
    QuillModule.forRoot()
  ],
  exports: [
    CommonModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FileSaverModule,
    FlexLayoutModule,
    MaterialModule,
    NzUploadModule,
    NextSolutionsModules,
    QuillModule,
    NzButtonModule,
    NzImageModule,
    Ng5SliderModule,
    NsInputViewComponent,
    NsInputViewHorizontalComponent,
    NsImageViewComponent,
    NsUploadFileComponent,
    DialogFooterComponent,
    BaseHeaderComponent,
    NsDownloadViewComponent,
    DialogHeaderComponent,
    NsQuillEditorComponent,
    NsDialogChooseComponent,
    DialogImportFileComponent,
    NsCounterInputNewsComponent,
    NsMultiSelectSeachApiAutocompleteComponent,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatSelectSearchModule
  ],
  providers: [
      UtilsService,
  // values
  // {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    { provide: NGX_MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS },
  ]
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
