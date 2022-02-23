/*
* Các cháu này là base class
* */
import { NavItem } from './models/nav.item';
import { ButtonClickModel } from './models/button.click.model';
import { ButtonFields } from './models/button.fields';
import { CheckboxModel } from './models/checkbox.model';
import { ColumnFields } from './models/column.fields';
import { ColumnTypes } from './models/enum/column.types';
import { AlignEnum } from './models/enum/align.enum';
import { IconTypeEnum } from './models/enum/icon.type.enum';
import { Menu } from './models/menu';
import { OAuth2AuthenticationDto } from './models/oauth/oAuth2AuthenticationDto';
import { Authority } from './models/oauth/authority';
import { Page } from './models/Page';
import { Paging } from './models/Paging';
import { RoleModel } from './models/role.model';
import { SelectModel } from './models/select.model';
import { UIState } from './models/ui.state/ui.state';
import { SuperEntity } from './models/SuperEntity';
import { FileTypes } from './models/enum/file.types';
import { UploadModel } from './models/upload.model';
import { BreadcrumbModel } from './models/breadcrumb.model';
import { TreeFields } from './models/tree.fields';
import { FooterFields } from './models/footer.fields';
import { DateRangePickerModel } from './models/date.range.picker.model';
import { FlatTreeConfigConvertObject } from './models/flat.tree.config.model';
import { FlatTreeNode } from './models/flat.tree.node.model';
import { DialogTypeEnum } from './models/enum/DialogTypeEnum';
import { NsCustomDialogDataConfig } from './models/ns.custom.dialog.data.config';
import { Principal } from "./models/oauth/principal";

export {
  NavItem,
  ButtonClickModel,
  ButtonFields,
  CheckboxModel,
  ColumnFields,
  ColumnTypes,
  FooterFields,
  Menu,
  OAuth2AuthenticationDto,
  Principal,
  Authority,
  Page,
  Paging,
  RoleModel,
  SelectModel,
  UIState,
  SuperEntity,
  AlignEnum,
  FileTypes,
  UploadModel,
  BreadcrumbModel,
  TreeFields,
  IconTypeEnum,
  DateRangePickerModel,
  FlatTreeNode,
  FlatTreeConfigConvertObject,
  NsCustomDialogDataConfig,
  DialogTypeEnum,
};

/*
* Các cháu này là dạng Injectable vs Component vs extend class for Component
* Khai báo providedIn: 'root' nên có thể dùng luôn ko cần khai báo Provides trong NgModule
* */
export { BaseTableLayout } from './layouts/BaseTableLayout';
export { BaseSearchLayout } from './layouts/BaseSearchLayout';
export { BaseAddEditLayout } from './layouts/BaseAddEditLayout';

export { MultiTranslateHttpLoader } from './services/MultiTranslateHttpLoader';

export { NsTable } from './components/table/ns-table';
export { NsSmartTable } from './components/table/ns-smart-table.component';
export { NsInput } from './components/ns-input';
export { NsCounterInput } from './components/ns-counter-input';
export { NsDatePicker } from './components/datepicker/ns-date-picker.component';
export { NsRangeDatePickerComponent } from './components/datepicker/ns-range-date-picker.component';
export { NsMultiSelectAutocomplete } from './components/ns-multi-select-autocomplete';
export { NsMultiUpload } from './components/upload/ns-multi-upload';
export { NsBreadcrumbComponent } from './components/ns-breadcrumb.component';
export { NsLoaderComponent } from './components/ns-loader.component';
export { NsTree } from './components/ns-tree';
export { NsCustomDialogComponent } from './components/ns-custom-dialog.component';
export { NsRadiobuttonComponent } from './components/ns-radiobutton.component';
export { NsFlatTreeComponent } from './components/tree/ns-flat-tree.component';
export { NsFlatTreeNodeLeftComponent } from './components/tree/ns-flat-tree-node-left.component';
export { NsFlatTreeNodeRightComponent } from './components/tree/ns-flat-tree-node-right.component';

export * from './services/api.service';
export * from './services/date-util.service';
export * from './services/form-state.service';
export * from './services/utils.service';
export * from './services/jsog.http.interceptor';
export * from './services/loader.service';
export * from './services/loader.interceptor';
export * from './services/ns-validator.service';
export * from './services/authorities.service';
export * from './services/authorities.resolver.service';
export * from './services/singleton.translate.service';
export * from './services/table.service';

export * from './modules/next.solutions.modules';
export * from './modules/next.solutions.config';

