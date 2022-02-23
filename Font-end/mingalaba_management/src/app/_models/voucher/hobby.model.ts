import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';


export class Hobby extends SuperEntity {
  id: number;
  name: string | undefined;
  status: number | undefined;

  constructor(id:number) {

    super()
    this.id = id;
  }

}
