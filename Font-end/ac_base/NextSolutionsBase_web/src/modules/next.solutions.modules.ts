import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NsTable } from '../components/table/ns-table';
import { CommonModule } from '@angular/common';
import { NsMaterialModule } from './ns-material.module';
import { NsMultiSelectAutocomplete } from '../components/ns-multi-select-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NsInput } from '../components/ns-input';
import { NsCounterInput } from '../components/ns-counter-input';
import { NsDatePicker } from '../components/datepicker/ns-date-picker.component';
import { InjectTokenNextSolutionsConfig, NextSolutionsConfig } from './next.solutions.config';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../services/api.service';
import { DateUtilService } from '../services/date-util.service';
import { FormStateService } from '../services/form-state.service';
import { UtilsService } from '../services/utils.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NsMultiUpload } from '../components/upload/ns-multi-upload';
import { DragDropDirective } from '../components/upload/drag-drop.directive';
import { NsBreadcrumbComponent } from '../components/ns-breadcrumb.component';
import { LoaderService } from '../services/loader.service';
import { NsLoaderComponent } from '../components/ns-loader.component';
import { NsValidator } from '../services/ns-validator.service';
import { NsSmartTable } from '../components/table/ns-smart-table.component';
import { NsTree } from '../components/ns-tree';
import { NsCustomDialogComponent } from '../components/ns-custom-dialog.component';
import { NsRadiobuttonComponent } from '../components/ns-radiobutton.component';
import { AuthoritiesService } from '../services/authorities.service';
import { AuthoritiesResolverService } from '../services/authorities.resolver.service';
import { StylePaginatorDirective } from '../directive/style.paginator.directive';
import { SingletonTranslateService } from '../services/singleton.translate.service';
import {NsRangeDatePickerComponent} from "../components/datepicker/ns-range-date-picker.component";
import {SecureImgPipe} from "../pipe/secure.pipe";
import {NsFlatTreeComponent} from "../components/tree/ns-flat-tree.component";
import {NsHeaderExpandButton} from "../components/table/ns-header-expand-button";
import {PatternDirective} from "../directive/pattern.directive";
import {InputFormatDirective} from "../directive/input-format.directive";
import {NsFlatTreeNodeLeftComponent, NsFlatTreeNodeRightComponent} from "..";

// @dynamic
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NsMaterialModule,
    RouterModule.forChild([]),
    TranslateModule.forChild(),
    FlexLayoutModule,
  ],
  declarations: [
    NsTable,
    NsSmartTable,
    NsInput,
    NsCounterInput,
    NsDatePicker,
    NsRangeDatePickerComponent,
    NsMultiSelectAutocomplete,
    DragDropDirective,
    NsMultiUpload,
    NsBreadcrumbComponent,
    NsLoaderComponent,
    NsTree,
    NsCustomDialogComponent,
    NsRadiobuttonComponent,
    StylePaginatorDirective,
    SecureImgPipe,
    NsFlatTreeComponent,
    NsFlatTreeNodeLeftComponent,
    NsFlatTreeNodeRightComponent,
    NsHeaderExpandButton,
    PatternDirective,
      InputFormatDirective
  ],
    exports: [
        NsTable,
        NsSmartTable,
        NsInput,
        NsCounterInput,
        NsDatePicker,
        NsRangeDatePickerComponent,
        NsMultiSelectAutocomplete,
        DragDropDirective,
        NsMultiUpload,
        NsBreadcrumbComponent,
        NsLoaderComponent,
        NsTree,
        NsCustomDialogComponent,
        NsRadiobuttonComponent,
        StylePaginatorDirective,
        NsFlatTreeComponent,
        SecureImgPipe,
        PatternDirective,
        InputFormatDirective,
        NsFlatTreeNodeLeftComponent,
        NsFlatTreeNodeRightComponent,
    ],
  entryComponents: [NsCustomDialogComponent],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class NextSolutionsModules {
  static forRoot(config?: { data: NextSolutionsConfig }): ModuleWithProviders<NextSolutionsModules> {
    return {
      ngModule: NextSolutionsModules,
      providers: [
        ApiService, DateUtilService, FormStateService, UtilsService, LoaderService, NsValidator,
        AuthoritiesService, AuthoritiesResolverService, SingletonTranslateService,
        { provide: InjectTokenNextSolutionsConfig, useValue: config ? config.data : {} }],
    };
  }
}
