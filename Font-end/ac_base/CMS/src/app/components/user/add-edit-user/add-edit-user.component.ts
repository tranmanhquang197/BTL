import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../../_services/api.service';
import {first} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UserModel} from '../../../_models/user.model';
import {UtilsService} from '@next-solutions/next-solutions-base';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddEditUserComponent>,
              private formBuilder: FormBuilder,
              private router: Router,
              private userService: ApiService,
              protected utilsService: UtilsService,
              @Inject(MAT_DIALOG_DATA) public user: UserModel) {
  }

  addEditForm: FormGroup | undefined;
  breakpoint: number | undefined;

  title = '';

  ngOnInit() {
    this.addEditForm = this.formBuilder.group({
      id: undefined,
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*')]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
    this.title = 'user.management.add';
    if (this.user) {
      this.title = 'user.management.edit';
      this.addEditForm.setValue(UtilsService.reduceEntityAttributeForFormControl(this.addEditForm, this.user));
    }
  }

  // onResize(event: any): void {
  //   this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  // }

  isEdit() {
    if (this.addEditForm?.controls.id.value) {
      return true;
    }
  }

  onSuccessFunc = (data: any, onSuccessMessage: string | undefined): void => {
    this.utilsService.onSuccessFunc(onSuccessMessage);
    this.dialogRef.close({value: true});
  }

  onSubmit() {
    if (this.isEdit()) {
      const method = this.userService.patch('/user/' + this.user.id, this.addEditForm?.value);
      this.utilsService.execute(method, this.onSuccessFunc, '.edit.success',
        'common.confirmSave', ['common.user.param']);
    } else {

      const method = this.userService.post('/user', this.addEditForm?.value);
      this.utilsService.execute(method, this.onSuccessFunc, '.add.success',
        'common.confirmSave', ['common.user.param']);
    }
  }
}
