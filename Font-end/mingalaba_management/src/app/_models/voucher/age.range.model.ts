import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';


export class AgeRange extends SuperEntity {
  id: number | undefined;
  age_from: number | undefined;
  age_to: number | undefined;
  status: number | undefined;

  constructor(id:number) {

    super()
    this.id = id;
  }

}
