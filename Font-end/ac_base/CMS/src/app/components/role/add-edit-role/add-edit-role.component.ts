import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../_services/api.service';
import {first, map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {NumberValidation} from '../../../validation/NumberValidation';
import {StringValidation} from '../../../validation/StringValidation';
import {RoleModel} from '../../../_models/role.model';
import {UtilsService} from '@next-solutions/next-solutions-base';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss']
})
export class AddEditRoleComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddEditRoleComponent>,
              private formBuilder: FormBuilder,
              private apiService: ApiService,
              protected utilsService: UtilsService,
              @Inject(MAT_DIALOG_DATA) public role: RoleModel) {
  }

  options: string[] = [];
  addEditForm: FormGroup | undefined;
  breakpoint: number | undefined;

  filteredOptions: Observable<string[]> | undefined;

  title = '';

  ngOnInit() {
    this.addEditForm = this.formBuilder.group({
      id: [],
      clientId: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      roleName: ['', [Validators.required, StringValidation.textNotAccentedValidation]],
      description: ['', Validators.required]
    });

    this.title = 'role.management.add';

    if (this.role) {
      this.title = 'role.management.edit';
      this.addEditForm.setValue(UtilsService.reduceEntityAttributeForFormControl(this.addEditForm, this.role));
    }
    this.apiService.getAllClientId('/oauthClient/getClientIds')
      .subscribe(data => {
        this.options = data as string[];
        this.filteredOptions = this.addEditForm?.controls.clientId.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      });
  }


  isEdit() {
    if (this.addEditForm?.controls.id.value) {
      return true;
    }
    return false;
  }

  onSubmit() {
    if (this.isEdit()) {
      const method = this.apiService.patch('/role/' + this.role.id, this.addEditForm?.value);
      this.utilsService.execute(method, this.onSuccessFunc, '.edit.success',
        'common.confirmSave', ['common.role.param']);
    } else {
      const method = this.apiService.post('/role', this.addEditForm?.value);
      this.utilsService.execute(method, this.onSuccessFunc, '.add.success',
        'common.confirmSave', ['common.role.param']);
    }
  }

  onSuccessFunc = (data: any, onSuccessMessage: string | undefined): void => {
    this.utilsService.onSuccessFunc(onSuccessMessage);
    this.dialogRef.close({value: true});
  }
  // onResize(event: any): void {
  //   this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getOptionValue($event: any) {
    this.addEditForm?.controls.clientId.setValue($event.option.value);
  }
}
