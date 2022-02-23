import {FormGroup} from '@angular/forms';

export class MenuModel {
  id: number | undefined;
  clientId: string | undefined;
  code: string | undefined;
  url: string | undefined;
  appType: string | undefined;
  parentMenu: MenuModel | undefined;

  constructor(form: FormGroup | number | undefined) {
    if (form instanceof FormGroup) {
      this.id = form.get('id')?.value;
      this.clientId = form.get('clientId')?.value;
      this.code = form.get('code')?.value;
      this.url = form.get('url')?.value;
      this.appType = form.get('appType')?.value;
      if (form.get('parentMenu')?.value) {
        this.parentMenu = new MenuModel(form.get('parentMenu')?.value);
      }
    } else {
      this.id = form;
    }
  }
}
