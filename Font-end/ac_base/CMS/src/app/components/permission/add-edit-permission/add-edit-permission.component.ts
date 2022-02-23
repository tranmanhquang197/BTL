import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../_services/api.service';
import {first} from 'rxjs/operators';
import {SelectModel, UtilsService} from '@next-solutions/next-solutions-base';
import {PermissionModel} from '../../../_models/permission.model';

@Component({
  selector: 'app-add-edit-permission',
  templateUrl: './add-edit-permission.component.html',
  styleUrls: ['./add-edit-permission.component.scss']
})
export class AddEditPermissionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddEditPermissionComponent>,
              private apiService: ApiService,
              private formBuilder: FormBuilder,
              protected utilsService: UtilsService,
              @Inject(MAT_DIALOG_DATA) public permission: PermissionModel) {
  }

  myControl = new FormControl();
  options: SelectModel[] = [];
  addEditForm: FormGroup | undefined;

  title = '';

  ngOnInit() {
    this.addEditForm = this.formBuilder.group({
      id: [],
      clientId: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      url: ['', [Validators.required]],
      description: ''
    });

    this.title = 'permission.management.add';
    if (this.permission) {
      this.title = 'permission.management.edit';
      this.addEditForm.setValue(UtilsService.reduceEntityAttributeForFormControl(this.addEditForm, this.permission));
    }

    this.apiService.getAllClientId('/oauthClient/getClientIds')
      .subscribe((data: string[] | any) => {
        this.options = data.map((client: any) => new SelectModel(client, client));
      });
  }

  isEdit(): boolean {
    if (this.addEditForm?.controls.id.value) {
      return true;
    }
    return false;
  }

  onSubmit() {
    if (this.isEdit()) {
      const method = this.apiService.patch('/permission/' + this.permission.id, this.addEditForm?.value);
      this.utilsService.execute(method, this.onSuccessFunc, '.edit.success',
        'common.confirmSave', ['common.permission.param']);
    } else {
      const method = this.apiService.post('/permission', this.addEditForm?.value);
      this.utilsService.execute(method, this.onSuccessFunc, '.edit.success',
        'common.confirmSave', ['common.permission.param']);
    }
  }

  onSuccessFunc = (data: any, onSuccessMessage: string | undefined): void => {
    this.utilsService.onSuccessFunc(onSuccessMessage);
    this.dialogRef.close({value: true});
  }
}
