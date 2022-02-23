export class FlatTreeNode {
    children?: FlatTreeNode[] = [];
    value: any;
    displayValue = '';
    checked?: boolean;
    checkedDisplay?: boolean;
    filterChecked?: boolean;
    level = 0;
    expandable?: boolean;
    isExpanded?: boolean; // storage expanded status in selected tree
    isFilterExpanded?: boolean; // storage expanded status in choose tree
    display?: boolean = true;
    _displayFuncInput?: ((node: any) => boolean) | boolean;
    disabled?: boolean = false;
    _disabledFuncInput?: ((node: any) => boolean) | boolean;
}
