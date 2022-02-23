import { Menu } from './menu';
import { AbstractControl, FormGroup } from '@angular/forms';
import {PermissionModel} from "./permission.model";

export class RoleModel {
  id: number | null = null;
  clientId: string | null = null;
  roleName: string | null = null;
  permissions: PermissionModel[] = [];
  menus: Menu[] = [];

  constructor(form: FormGroup | number) {
    if (!form) {
      return;
    }
    if (form instanceof FormGroup) {
      const formId: AbstractControl | null = form.get('id');
      if (formId) {
        this.id = formId.value;
      }
      const formClientId: AbstractControl | null = form.get('clientId');
      if (formClientId) {
        this.clientId = formClientId.value;
      }
      const formRoleName: AbstractControl | null = form.get('roleName');
      if (formRoleName) {
        this.roleName = formRoleName.value;
      }
    } else {
      this.id = form;
    }
  }
}
