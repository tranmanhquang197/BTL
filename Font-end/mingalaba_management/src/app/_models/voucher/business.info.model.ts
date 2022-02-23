import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';


export class BusinessInfo extends SuperEntity {
  name: number | undefined;
  address: number | undefined;
  phone: number | undefined;

  constructor(id:number) {

    super()
    this.id = id;
  }

}
