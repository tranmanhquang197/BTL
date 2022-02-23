import { SuperEntity } from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';
import { Hobby } from './hobby.model';
import { AgeRange } from './age.range.model';


export class VoucherDistribute extends SuperEntity {
  id: number | undefined;
  gender: string | undefined;
  address: string | undefined;
  hobbies: Hobby[] | undefined;
  age_from: number | undefined;
  age_to: number | undefined;
  other_information: string |undefined;
  district : {
    id: number,
    name: string
  } | undefined;

  township:{
    id:number,
    name: string
  }[]|undefined;

  customer:{
    display_name:string,
    username:string
  }[]|undefined;

  constructor(form: FormGroup | number | undefined | null) {
    super();
  }



}
