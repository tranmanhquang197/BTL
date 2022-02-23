import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';


export class User extends SuperEntity {
  id: number | undefined;
  avatar: string | undefined;
  title: string | undefined;
  display_name: string | undefined;
  language_code: string | undefined;
  username: string | undefined;

  constructor(id:number) {

    super()
    this.id = id;
  }
}
