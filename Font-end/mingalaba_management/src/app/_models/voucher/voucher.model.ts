import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';
import { User } from '../../_models/voucher/user.model';
import { VoucherDistribute } from './voucher.distribute.model';
import { Hobby } from './hobby.model';
import { VoucherCategory } from './voucher.category.model';
import {File} from './file.model';


export class Voucher extends SuperEntity {
  id: number | undefined;
  file_url?: string;
  type: VoucherCategory | undefined;
  title: string | undefined;
  description: string | undefined;
  quantity: number | undefined;
  phone_number: string | undefined;
  address: string|undefined;
  number_of_used: number | undefined;
  hobbies: Hobby[] | undefined;
  from_date: any;
  to_date: any;
  published_date : any;
  file: File | undefined;
  sale_man: User | undefined;
  user: User | undefined;
  business_name :string | undefined;
  status: number | undefined;
  voucher_distribute : VoucherDistribute | undefined;
  other_information: string| undefined;
  created_at: string | undefined;
  totalVoucher = 0; // to display not storage


  constructor(form: FormGroup | number | undefined | null | any) {
    super();
    if (form){
      if (form instanceof FormGroup) {
        const fId = form.get('id');
        if (fId) {
          this.id = fId.value;
        }
        const fType = form.get('type');
        if (fType) {
          this.type = fType.value;
        }
        const fTitle = form.get('title');
        if (fTitle) {
          this.title = fTitle.value;
        }
        const fDescription = form.get('description');
        if (fDescription) {
          this.description = fDescription.value;
        }
        const fFromDate = form.get('from_date');
        if (fFromDate) {
          this.from_date = fFromDate.value;
        }
        const fToDate = form.get('to_date');
        if (fToDate) {
          this.to_date = fToDate.value;
        }
        const fPublishedDate = form.get('published_date');
        if (fPublishedDate) {
          this.published_date = fPublishedDate.value;
        }

        const fPhoneNumber = form.get('phone_number');
        if (fPhoneNumber) {
          this.phone_number = fPhoneNumber.value;
        }
        const fFile = form.get('image');
        if(fFile){
          this.file = new File(0,'',fFile.value);
        }

      }
      else if(form instanceof Object){
        const fId = form.id;
        if (fId) {
          this.id = fId;
        }
        const business_name = form.user?.display_name;
        if (business_name) {
          this.business_name = business_name;
        }
      }
      else {
        this.id = form;
      }
    }
  }




}
