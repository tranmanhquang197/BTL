export class FlatTreeConfigConvertObject {
    isDynamicConfig = false; /* bằng true khi muốn call liên tục hàm display và hàm disabled */
    display: ((node: any) => boolean) | boolean = true;
    disabled: ((node: any) => boolean) | boolean = false;
}
