import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../_services/api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {UtilsService} from '@next-solutions/next-solutions-base';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-add-edit-client',
  templateUrl: './add-edit-client.component.html',
  styleUrls: ['./add-edit-client.component.scss']
})
export class AddEditClientComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private dialogRef: MatDialogRef<AddEditClientComponent>,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    // data : {client: ClientModel, isView: boolean}
  }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };
// Constant
  READ_SCOPE = 'read';
  WRITE_SCOPE = 'write';

  // Authorities
  ROLE_CLIENT = 'ROLE_CLIENT';
  ROLE_TRUSTED_CLIENT = 'ROLE_TRUSTED_CLIENT';

  // authorized_grant_types
  PASSWORD_GRANT_TYPE = 'password';
  REFRESH_TOKEN = 'refresh_token';
  CLIENT_CREDENTIALS = 'client_credentials';
  AUTHORIZATION_CODE = 'authorization_code';

  SPERATOR = ',';


  title = '';
  addEditForm: FormGroup | undefined;
  scopes: string[] = [];
  authoritiesArr: string[] = [];
  // tslint:disable-next-line:variable-name
  grant_typeArr: string[] = [];


  ngOnInit() {
    this.title = 'client.management.add';
    const integerRegex = '^[0-9]+$';
    this.addEditForm = this.formBuilder.group({
      clientId: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      resourceIds: '',
      clientSecret: '',
      scope: '',
      authorizedGrantTypes: '',
      webServerRedirectUri: '',
      authorities: '',
      accessTokenValidity: ['', [Validators.pattern(integerRegex)]],
      refreshTokenValidity: ['', [Validators.pattern(integerRegex)]],
      additionalInformation: '',
      autoapprove: ''
    });


    if (this.data && this.data.isView) {
      this.title = 'client.management.detail';
      this.apiService.get('/oauthClient/' + this.data.client.clientId, new HttpParams())
        .subscribe(data => {
          this.addEditForm?.setValue(UtilsService.reduceEntityAttributeForFormControl(this.addEditForm, this.data.client));
          this.setScopesData();
          this.setAuthoritiesData();
          this.setGrant_typeArrData();
        });
    } else if (this.data && this.data.client) {
      this.title = 'client.management.edit';
      this.apiService.get('/oauthClient/' + this.data.client.clientId, new HttpParams())
        .subscribe(data => {
          this.addEditForm?.setValue(UtilsService.reduceEntityAttributeForFormControl(this.addEditForm, this.data.client));
          this.setScopesData();
          this.setAuthoritiesData();
          this.setGrant_typeArrData();
        });
    }
  }


  isCreate() {
    if (!this.data) {
      return true;
    }
  }

  isDetail() {
    return this.data && this.data.isView;
  }

  isEdit() {
    return this.data && !this.data.isView;
  }

  onSubmit() {
    if (this.isCreate()) {
      this.apiService.post('/oauthClient', this.addEditForm?.value)
        .subscribe(data => {
            this.dialogRef.close({value: true});
          },
          error1 => {
            this.snackBar.open('This application code is existed!', '', this.config);
          });
    } else {
      this.apiService.patch('/oauthClient/' + this.data.client.clientId, this.addEditForm?.value)
        .pipe()
        .subscribe(data => {
          this.dialogRef.close({value: true});
        });
    }
  }

  // Create scope
  createScope($event: MatCheckboxChange) {
    const data = $event.source;
    if ($event.checked) {
      if (data.id === this.READ_SCOPE) {
        this.scopes[0] = data.value;
      } else if (data.id === this.WRITE_SCOPE) {
        this.scopes[1] = data.value;
      }
    } else {
      if (data.id === this.READ_SCOPE) {
        // this.scopes.splice(0, 1);
        this.scopes[0] = '';
      } else if (data.id === this.WRITE_SCOPE) {
        if (this.scopes.length < 2) {
          this.scopes.splice(0, 1);
        } else {
          this.scopes.splice(1, 1);
        }
      }
    }
    const scopesString = this.scopes.toString();
    const scopeForm = this.addEditForm?.controls.scope;
    if (scopeForm) {
      if (scopesString.startsWith(this.SPERATOR)) {
        scopeForm.setValue(scopesString.substring(1, scopesString.length));
      } else if (scopesString.endsWith(this.SPERATOR)) {
        scopeForm.setValue(scopesString.substring(0, scopesString.length - 1));
      } else {
        scopeForm.setValue(scopesString);
      }
    }
  }

  isCheckedScope(value: string): boolean {
    if (this.scopes.includes(value)) {
      return true;
    }
    return false;
  }

  private setScopesData() {
    const scopeString = this.addEditForm?.controls.scope.value.toString();
    if (scopeString.includes(this.SPERATOR)) {
      this.scopes = scopeString.split(this.SPERATOR);
    } else {
      if (scopeString === this.READ_SCOPE) {
        this.scopes = [scopeString, ''];
      } else {
        this.scopes = ['', scopeString];
      }
    }
    console.log(this.scopes);
  }

  // Create authorities

  createAuthorities($event: MatCheckboxChange) {
    const data = $event.source;
    if ($event.checked) {
      if (data.id === this.ROLE_CLIENT) {
        this.authoritiesArr[0] = data.value;
      } else if (data.id === this.ROLE_TRUSTED_CLIENT) {
        this.authoritiesArr[1] = data.value;
      }
    } else {
      if (data.id === this.ROLE_CLIENT) {
        // this.authoritiesArr.splice(0, 1);
        this.authoritiesArr[0] = '';
      } else if (data.id === this.ROLE_TRUSTED_CLIENT) {
        if (this.authoritiesArr.length < 2) {
          this.authoritiesArr.splice(0, 1);
        } else {
          this.authoritiesArr.splice(1, 1);
        }
      }
    }
    const authoritiesArrString = this.authoritiesArr.toString();
    const authoritiesForm = this.addEditForm?.controls.authorities;
    if (authoritiesForm) {
      if (authoritiesArrString.startsWith(this.SPERATOR)) {
        authoritiesForm.setValue(authoritiesArrString.substring(1, authoritiesArrString.length));
      } else if (authoritiesArrString.endsWith(this.SPERATOR)) {
        authoritiesForm.setValue(authoritiesArrString.substring(0, authoritiesArrString.length - 1));
      } else {
        authoritiesForm.setValue(authoritiesArrString);
      }
    }
  }

  isCheckedAuthorities(value: string): boolean {
    if (this.authoritiesArr.includes(value)) {
      return true;
    }
    return false;
  }

  private setAuthoritiesData() {
    const authoritiesString = this.addEditForm?.controls.authorities.value.toString();
    if (authoritiesString) {
      if (authoritiesString.includes(this.SPERATOR)) {
        this.authoritiesArr = authoritiesString.split(this.SPERATOR);
      } else {
        if (authoritiesString === this.ROLE_CLIENT) {
          this.authoritiesArr = [authoritiesString, ''];
        } else {
          this.authoritiesArr = ['', authoritiesString];
        }
      }
    }
  }

  // Create authorized_grant_type
  createGrant_type($event: MatCheckboxChange) {
    const data = $event.source;
    if ($event.checked) {
      if (data.id === this.PASSWORD_GRANT_TYPE) {
        this.grant_typeArr[0] = data.value;
      } else if (data.id === this.REFRESH_TOKEN) {
        this.grant_typeArr[1] = data.value;
      } else if (data.id === this.CLIENT_CREDENTIALS) {
        this.grant_typeArr[2] = data.value;
      } else if (data.id === this.AUTHORIZATION_CODE) {
        this.grant_typeArr[3] = data.value;
      }
    } else {
      if (data.id === this.PASSWORD_GRANT_TYPE) {
        this.grant_typeArr[0] = '';
      } else if (data.id === this.REFRESH_TOKEN) {
        this.grant_typeArr[1] = '';
      } else if (data.id === this.CLIENT_CREDENTIALS) {
        this.grant_typeArr[2] = '';
      } else if (data.id === this.AUTHORIZATION_CODE) {
        this.grant_typeArr[3] = '';
      }
    }
    // tslint:disable-next-line:variable-name
    const grant_typeArrString = this.grant_typeArr.toString();
    this.addEditForm?.controls.authorizedGrantTypes.setValue(grant_typeArrString);
    // tslint:disable-next-line:variable-name
    // const grant_typeForm = this.addEditForm.controls.authorizedGrantTypes;
  }

  isCheckedGrant_type(value: string): boolean {
    if (this.grant_typeArr.includes(value)) {
      return true;
    }
    return false;
  }

  private setGrant_typeArrData() {
    // tslint:disable-next-line:variable-name
    const grant_typeString = this.addEditForm?.controls.authorizedGrantTypes.value.toString();
    if (grant_typeString) {
      if (grant_typeString.includes(this.SPERATOR)) {
        this.grant_typeArr = grant_typeString.split(this.SPERATOR);
      } else {
        if (grant_typeString === this.PASSWORD_GRANT_TYPE) {
          this.grant_typeArr = [grant_typeString, '', '', ''];
        } else if (grant_typeString === this.REFRESH_TOKEN) {
          this.grant_typeArr = ['', grant_typeString, '', ''];
        } else if (grant_typeString === this.CLIENT_CREDENTIALS) {
          this.grant_typeArr = ['', '', grant_typeString, ''];
        } else if (grant_typeString === this.AUTHORIZATION_CODE) {
          this.grant_typeArr = ['', '', '', grant_typeString];
        }
      }
    }
  }
}
