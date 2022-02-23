import {AlignEnum} from "./enum/align.enum";
import {IconTypeEnum} from "./enum/icon.type.enum";

export class ButtonFields {
  columnDef: string = '';
  color?: string = 'warn';
  icon: string = '';
  iconType?: IconTypeEnum = IconTypeEnum.MATERIAL_ICON;
  click: string = '';
  isShowHeader?: boolean;
  title?: string = '';
  display?: (e: any) => boolean;
  disabled?: (e: any) => boolean;
  className?: string;
  header?: ButtonFields | string;
  alignHeader?: AlignEnum;
}
