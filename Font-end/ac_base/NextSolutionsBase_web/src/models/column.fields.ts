import { ColumnTypes } from './enum/column.types';
import { SelectModel } from './select.model';
import { AlignEnum } from './enum/align.enum';
import { FooterFields } from './footer.fields';
import {ButtonFields} from "./button.fields";

export class ColumnFields {
  columnDef: string = '';
  header: ((e: any) => string) | string | undefined;
  title: (e: any) => string = (e) => `${e}`;
  cell: (e: any) => string = (e) => `${e}`;
  // set default theo ly thuyet, phai gan lai
  align?: AlignEnum = AlignEnum.LEFT;
  alignHeader?: AlignEnum;

  // phục vụ cho loại cột là hiển thị đường dẫn
  link?: (e:any) => string;

  // Phục vụ cho style css
  style?: (e:any) => string;

  className?: ((e: any) => string) | string;
  headerClassName?: (() => string) | string;
  columnType?: ColumnTypes | ((e: any) => ColumnTypes) = ColumnTypes.VIEW;
  onCellValueChange?: (e: any) => void;
  onHeaderCellValueChange?: (val: any) => void;
  disabled?: (e: any) => boolean;
  optionValues?: (e: any) => SelectModel[];
  display?: (e: any) => boolean;
  isShowHeader?: boolean = false;
  isNotShowHeaderCheckbox?: boolean = false;
  isRequired?: boolean | (() => boolean) = false;
  min?: (e: any) => any;
  max?: (e: any) => any;
  hasWordBreakStyle?: boolean = false;
  validate?: (e: any) => any | null;
  errorMessage?: Map<string, () => string>;
  isTree?: boolean = false;
  isDecimal?: boolean | (() => boolean) = false;
  isExpandOptionColumn?: () => boolean;
  footer?: FooterFields;
  footers?: FooterFields[] = [];
  button?: ButtonFields;
}
