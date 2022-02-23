import {DialogTypeEnum} from "./enum/DialogTypeEnum";

export class NsCustomDialogDataConfig {
    type: DialogTypeEnum = DialogTypeEnum.CONFIRM;
    maxLength?: number;
    msg?: string;
    msgDetail?: string;
    errorMsg?: string;
    btnOKString?: string;
    btnOKClass?: string;
    btnOK_IconClass?: string;
    btnCancelClass?: string;
    btnCancel_IconClass?: string;
    btnCancelString?: string;
    customClass?: string;
    hideIconButton?: boolean;
}
