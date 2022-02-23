import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../_services/api.service';
import {MenuModel} from '../../../_models/MenuModel';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SelectModel, UtilsService} from '@next-solutions/next-solutions-base';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-add-edit-menu',
  templateUrl: './add-edit-menu.component.html',
  styleUrls: ['./add-edit-menu.component.scss']
})
export class AddEditMenuComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<AddEditMenuComponent>,
              private formBuilder: FormBuilder,
              private apiService: ApiService,
              @Inject(MAT_DIALOG_DATA) public menu: MenuModel,
              protected utilsService: UtilsService) {
  }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  menuOptions: SelectModel[] = [];
  options: SelectModel[] = [];
  addEditForm: FormGroup | undefined;
  title = '';
  parentMenu: any;

  ngOnInit() {
    this.addEditForm = this.formBuilder.group({
      id: [],
      code: ['', [Validators.required, Validators.pattern('[a-zA-Z_]+([a-zA-Z_ ]+)*')]],
      clientId: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      url: '',
      appType: ['', [Validators.required]],
      parentMenu: []
    });

    this.apiService.get('/menu/getAll', new HttpParams())
      .subscribe((data: MenuModel[] | any) => {
        this.menuOptions.push(...data.map((menu: any) => new SelectModel(menu.id, menu.code)));
        this.menuOptions.splice(0, 0, new SelectModel(-1, 'No parent'));
      });

    this.title = 'menu.management.add';
    if (this.menu) {
      this.title = 'menu.management.edit';
      this.addEditForm.setValue(UtilsService.reduceEntityAttributeForFormControl(this.addEditForm, this.menu));
      this.addEditForm.get('parentMenu')?.setValue(this.menu.parentMenu ? this.parentMenu.id : -1);
      this.addEditForm.updateValueAndValidity();
    }

    this.apiService.getAllClientId('/oauthClient/getClientIds')
      .subscribe((data: string[] | any) => {
        this.options = data.map((client: any) => new SelectModel(client, client));
      });


  }

  isEditAction(): boolean {
    return !!this.addEditForm?.controls.id.value;
  }

  // onResize(event: any): void {
  //   this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  // }


  onSubmit() {
    if (this.addEditForm?.controls.parentMenu.value === -1) {
      this.addEditForm.controls.parentMenu.setValue(null);
    }
    const menu = new MenuModel(this.addEditForm);
    if (this.isEditAction()) {
      const method = this.apiService.patch('/menu/' + this.menu.id, menu);
      this.utilsService.execute(method, this.onSuccessFunc, '.edit.success',
        'common.confirmSave', ['common.menu.param']);
    } else {
      const method = this.apiService.post('/menu', menu);
      this.utilsService.execute(method, this.onSuccessFunc, '.add.success',
        'common.confirmSave', ['common.menu.param']);
    }
  }

  onSuccessFunc = (data: any, onSuccessMessage: string | undefined): void => {
    this.utilsService.onSuccessFunc(onSuccessMessage);
    this.dialogRef.close({value: true});
  }
}
