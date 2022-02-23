import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../../../_services/api.service';
import {first} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';
import {MenuModel} from '../../../_models/MenuModel';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {RoleModel} from '../../../_models/role.model';
import {UtilsService} from '@next-solutions/next-solutions-base';

@Component({
  selector: 'app-add-edit-role-permission',
  templateUrl: './add-edit-role-permission.component.html',
  styleUrls: ['./add-edit-role-permission.component.scss']
})
export class AddEditRolePermissionComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddEditRolePermissionComponent>,
              private formBuilder: FormBuilder,
              private apiService: ApiService,
              private utilsService: UtilsService,
              @Inject(MAT_DIALOG_DATA) public roleParam: RoleModel) {
  }

  MOBILE = 'MOBILE';
  WEB = 'WEB';
  title = '';
  // tslint:disable-next-line:ban-types
  menuList: any = [];
  permissionList: any;
  menuIds: (number | undefined)[] = [];
  permissionIds: number[] = [];

  role: any;
  addEditForm: FormGroup | undefined;

  menuLv1: MenuModel[] = [];
  menuLv2: MenuModel[] = [];

  ngOnInit() {
    this.menuIds = [];
    this.permissionIds = [];
    this.title = 'role.management.addPermission';
    this.apiService.get('/role/' + this.roleParam.id, new HttpParams())
      .subscribe(role => {
        this.role = role;
        for (const menu of this.role.menus) {
          this.menuIds.push(menu.id);
        }
        for (const permission of this.role.permissions) {
          this.permissionIds.push(permission.id);
        }
        const params = new HttpParams()
          .set('client-id', this.role.clientId ? this.role.clientId : '');
        this.apiService.get('/menu/client-id', params)
          .subscribe(menuList => {
            this.menuList = menuList;
            this.setMenuLv();
          });

        this.apiService.get('/permission/client-id', params)
          .subscribe(permissionList => {
            this.permissionList = permissionList;
          });
      });
  }

  private setMenuLv() {
    const parentMenuIds = [];
    for (const menu of this.menuList) {
      if (menu.parentMenu === null) {
        this.menuLv1.push(menu);
        parentMenuIds.push(menu.id);
      }
    }
    parentMenuIds.slice(0, parentMenuIds.length);
    for (const menu of this.menuList) {
      if (menu.parentMenu != null && parentMenuIds.includes(menu.parentMenu.id) && !this.menuLv1.includes(menu)) {
        this.menuLv2.push(menu);
      }
    }
  }

  onSubmit() {
    const menuFormArray = this.formBuilder.array([]);
    const permissionFormArray = this.formBuilder.array([]);
    for (const menuId of this.menuIds) {
      const menuCtrl = new FormControl({
        id: menuId
      });
      menuFormArray.push(menuCtrl);
    }

    for (const permissionId of this.permissionIds) {
      const permissionCtrl = new FormControl({
        id: permissionId
      });
      permissionFormArray.push(permissionCtrl);
    }

    const formGroup = this.formBuilder.group({
      clientId: this.role.clientId,
      roleName: this.role.roleName,
      description: this.role.description,
      menus: menuFormArray,
      permissions: permissionFormArray
    });

    const method = this.apiService.patch('/role/' + this.role.id, formGroup.value);
    this.utilsService.execute(method, this.onSuccessFunc, '.edit.success',
      'common.confirmSave', ['common.role.param']);

  }

  onSuccessFunc = (data: any, onSuccessMessage: string | undefined): void => {
    this.utilsService.onSuccessFunc(onSuccessMessage);
    this.dialogRef.close({value: true});
  }

  isChecked(id: any, type: string) {
    if (type === 'menu') {
      if (this.menuIds.includes(id)) {
        return true;
      }
    } else if (type === 'permission') {
      if (this.permissionIds.includes(id)) {
        return true;
      }
    }
  }

  changePermission($event: MatCheckboxChange) {
    const permissionId = $event.source.value;
    if ($event.checked) {
      this.permissionIds.push(Number(permissionId));
    } else {
      const index = this.permissionIds.indexOf(Number(permissionId));
      this.permissionIds.splice(index, 1);
    }
  }

  changeMenuChild($event: MatCheckboxChange) {
    const menuId = Number($event.source.value);
    this.changeMenuCurrent($event.checked, menuId);
    const menuChild = this.getMenuById(this.menuLv2, menuId);
    this.changeMenuParent($event.checked, this.menuLv1, this.menuLv2, menuChild);
  }

  changeMenuParent(isChecked: boolean, parentMenus: MenuModel[], childMenus: MenuModel[], menuChild: MenuModel | null) {
    if (menuChild) {
      for (const menuParent of parentMenus) {
        if ( menuChild.parentMenu && menuChild.parentMenu.id === menuParent.id) {
          if (isChecked) {
            if (this.menuIds.indexOf(menuParent.id) === -1) {
              this.menuIds.push(Number(menuParent.id));
            }
          } else {
            let childMenuCheckedNum = 0;
            for (const menu of childMenus) {
              if (menu.parentMenu && menu.parentMenu.id === menuParent.id) {
                if (this.menuIds.indexOf(menu.id) !== -1) {
                  childMenuCheckedNum++;
                }
              }
            }
            if (childMenuCheckedNum === 0) {
              const index = this.menuIds.indexOf(menuParent.id);
              this.menuIds.splice(index, 1);
            }
          }
        }
      }
    }
  }

  changeMenuAll($event: MatCheckboxChange) {
    const menuId = Number($event.source.value);
    this.changeMenuCurrent($event.checked, menuId);
    this.changeMenuChildAll($event.checked, this.menuLv2, menuId);
  }

  changeMenuCurrent(isChecked: boolean, menuId: number) {
    if (isChecked) {
      this.menuIds.push(menuId);
    } else {
      const index = this.menuIds.indexOf(menuId);
      this.menuIds.splice(index, 1);
    }
  }

  changeMenuChildAll(isChecked: boolean, childMenus: MenuModel[], menuParentId: number) {
    for (const menuChild of childMenus) {
      if (menuChild.parentMenu && menuParentId === menuChild.parentMenu.id) {
        if (isChecked) {
          this.menuIds.push(menuChild.id);
        } else {
          const index = this.menuIds.indexOf(menuChild.id);
          this.menuIds.splice(index, 1);
        }
      }
    }
  }

  getMenuById(menus: MenuModel[], id: number): MenuModel | null {
    for (const menu of menus) {
      if (menu.id === id) {
        return menu;
      }
    }
    return null;
  }
}
