import {Kpi} from './kpi.model';
import {FormGroup} from '@angular/forms';

export class KpiPolicy {
  id: number | undefined | null;
  kpi: Kpi | undefined | null;
  type: string | undefined | null;
  code: string | undefined | null;
  fromDate: string | undefined | null;
  toDate: string | undefined;

  constructor(form: FormGroup | number | undefined | null) {
    if (form){
      if (form instanceof FormGroup) {

        const fId = form.get('id');
        if (fId && fId.value) {
          this.id = fId.value
        }

        const fKpi = form.get('kpi');
        this.kpi = new Kpi(fKpi?.value);

        const fType = form.get('type');
        this.type = fType?.value;

        const fCode = form.get('code');
        this.code = fCode?.value;

        const fFromDate = form.get('fromDate');
        this.fromDate = fFromDate?.value;

        const fToDate = form.get('toDate');
        this.toDate = fToDate?.value;

      } else {
        this.id = form;
      }
    }

  }
}
