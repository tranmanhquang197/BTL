import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {ApiService} from '../../../_services/api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {UserModel} from '../../../_models/user.model';
import {UtilsService} from '@next-solutions/next-solutions-base';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-add-role-user',
  templateUrl: './add-role-user.component.html',
  styleUrls: ['./add-role-user.component.scss']
})
export class AddRoleUserComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddRoleUserComponent>,
              private formBuilder: FormBuilder,
              private apiService: ApiService,
              private utilsService: UtilsService,
              @Inject(MAT_DIALOG_DATA) public userData: UserModel) {

  }

  title: string | undefined;
  user: any;
  roleList: any;
  roleIds: number[] = [];

  ngOnInit() {
    this.title = 'user.management.addRole';
    this.apiService.get('/user/' + this.userData.id, new HttpParams())
      .subscribe(user => {
        this.user = user;
        for (const role of this.user.roles) {
          this.roleIds.push(role.id);
        }
      });

    this.apiService.get('/role/getAll', new HttpParams())
      .subscribe(roleList => {
        this.roleList = roleList;
      });
  }

  onSubmit() {
    const roleFromArray = this.formBuilder.array([]);
    for (const role of this.roleList) {
      if (this.roleIds.includes(role.id)) {
        const roleCtrl = new FormControl({
          id: role.id,
        });
        roleFromArray.push(roleCtrl);
      }
    }

    const formGroup = this.formBuilder.group({
      username: this.user.username,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      roles: roleFromArray
    });

    const method = this.apiService.patch('/user/' + this.user.id, formGroup.value);
    this.utilsService.execute(method, this.onSuccessFunc, '.edit.success',
      'common.confirmSave', ['common.user.param']);
  }

  onSuccessFunc = (data: any, onSuccessMessage: string | undefined): void => {
    this.utilsService.onSuccessFunc(onSuccessMessage);
    this.dialogRef.close({value: true});
  }

  isChecked(roleId: any) {
    if (this.roleIds.includes(roleId)) {
      return true;
    }
  }

  createRoleIds($event: MatCheckboxChange) {
    const roleId = $event.source.value;
    if ($event.checked) {
      this.roleIds.push(Number(roleId));
    } else {
      const index = this.roleIds.indexOf(Number(roleId));
      this.roleIds.splice(index, 1);
    }
  }
}
