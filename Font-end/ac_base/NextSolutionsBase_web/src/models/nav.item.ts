export class NavItem {
  displayName: string = '';
  disabled?: boolean = true;
  iconName: string = '';
  roleMenu: string = '';
  route?: string = '';
  children?: NavItem[] = [];
  isOnlyIcon: boolean = true;
  expanded: boolean = false;
}
