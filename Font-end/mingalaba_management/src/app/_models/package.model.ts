import {SuperEntity} from '@next-solutions/next-solutions-base';
import {FormGroup} from '@angular/forms';

export class Package extends SuperEntity {
  id: number | undefined | null;
  clientId: string | undefined | null;
  code: string | undefined | null;
  name: string | undefined | null;
  description: string | undefined | null;
  status: string | undefined | null;
  rejectReason: string | undefined | null;

  constructor(form: FormGroup | number) {
    super();
    if (form instanceof FormGroup) {
      const fId = form.get('id');
      if (fId) {
        this.id = fId.value;
      }
      const fClientId = form.get('clientId');
      if (fClientId) {
        this.clientId = fClientId.value;
      }
      const fCode = form.get('code');
      if (fCode) {
        this.code = fCode.value;
      }
      const fName = form.get('name');
      if (fName) {
        this.name = fName.value;
      }
      const fDescription = form.get('description');
      if (fDescription) {
        this.description = fDescription.value;
      }
      const fStatus = form.get('status');
      if (fStatus) {
        this.status = fStatus.value;
      }
    } else {
      this.id = form;
    }
  }
}
