import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';


export class VoucherCategory extends SuperEntity {
  id: number | undefined;
  name: string | undefined;
  status: string | undefined;


  constructor(id:number) {
    super()
    this.id = id;
  }
}
