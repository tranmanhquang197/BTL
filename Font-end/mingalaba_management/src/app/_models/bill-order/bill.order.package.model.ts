import {SuperEntity, UploadModel} from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';

export class BillOrderPackageModel extends SuperEntity {
  id: number | undefined | null;
  name: string | undefined;
  extra_cost: number | undefined | null;
  extra_amount_percent: number | undefined;
  type: string | undefined;
  parity_price: number | undefined;
  code: number | undefined;
  description: string | undefined | null;
  status: string | undefined | null;


  constructor(form: FormGroup | number | undefined | null) {
    super();
    if (form) {
      if (form instanceof FormGroup) {

        const fId = form.get('id');
        if (fId && fId.value) {
          this.id = Number(fId.value);
        }
        const name = form.get('name');
        this.name = name?.value;

        const extra_cost = form.get('extra_cost');
        this.extra_cost = extra_cost?.value;
        const extra_amount_percent = form.get('extra_amount_percent');
        this.extra_amount_percent = extra_amount_percent?.value;
        const type = form.get('type');
        this.type = type?.value;
        const parity_price = form.get('parity_price');
        this.parity_price = parity_price?.value;
        const code = form.get('code');
        this.code = code?.value;
        const description = form.get('description');
        this.description = description?.value;
        const status = form.get('status');
        this.status = status?.value;
      }
    }
  }

}
