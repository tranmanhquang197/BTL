import {FlatTreeNode, SuperEntity} from '@next-solutions/next-solutions-base';
import {FormGroup} from '@angular/forms';

export class Level extends FlatTreeNode {
  checked = false;
  invalid = false;
  clientId: string | undefined;
  code: string | undefined;
  description: string | undefined;
  id: number | undefined;
  name: string | undefined;
  rejectReason: string | undefined;
  status: 'ACCEPTED' | 'DRAFT' | 'REJECTED' | string | undefined;

  constructor(form: FormGroup | number | undefined) {
    super();
    if (form instanceof FormGroup) {
      const fClientId = form.get('clientId');
      if (fClientId?.value) {
        this.clientId = fClientId.value;
      }
      const fCode = form.get('code');
      if (fCode?.value) {
        this.code = fCode.value;
      }
      const fName = form.get('name');
      if (fName?.value) {
        this.name = fName.value;
      }
      const fStatus = form.get('status');
      if (fStatus?.value) {
        this.status = fStatus.value;
      }
      const fDescription = form.get('description');
      if (fDescription?.value) {
        this.description = fDescription.value;
      }
    } else {
      this.id = form;
    }
  }
}
