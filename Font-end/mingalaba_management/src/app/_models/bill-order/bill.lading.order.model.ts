import {SuperEntity, UploadModel} from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';
import { BillOrderPackageModel } from './bill.order.package.model';

export class BillLadingOrderModel extends SuperEntity {
  id: number | undefined | null;
  name: string | undefined;
  name_seq: string | undefined;
  insurance_name: string | undefined | null;
  total_weight: number | undefined | null;
  total_amount: number | undefined;
  tolls: number | undefined;
  surcharge: number | undefined;
  total_volume: number | undefined;
  vat: number | undefined;
  promotion_code: number | undefined;
  total_parcel: number | undefined;
  company_id: number | undefined;
  start_date: string | undefined | null;
  end_date: string | undefined | null;
  create_date: string | undefined | null;
  bill_state: string | undefined | null;
  subscribe_name: string | undefined | null;
  frequency: number|undefined ;
  day_of_week: number | undefined | null;
  day_of_month: number | undefined | null;
  description: string | undefined | null;
  status: string | undefined | null;
  user_book_name: string | undefined | null;
  title_award_name: string | undefined | null;
  cycle_type: string | undefined | null;
  oder_package : BillOrderPackageModel| undefined;

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

        const name_seq = form.get('name_seq');
        this.name_seq = name_seq?.value;

        const insurance_name = form.get('insurance_name');
        this.insurance_name = insurance_name?.value;

        const user_book_name = form.get('user_book_name');
        this.user_book_name = user_book_name?.value;

        const oder_package = form.get('oder_package');
        this.oder_package = oder_package?.value;

        const total_weight = form.get('total_weight');
        this.total_weight = total_weight?.value;

        const total_amount = form.get('total_amount');
        this.total_amount = total_amount?.value;

        const tolls = form.get('tolls');
        this.tolls = tolls?.value;

        const surcharge = form.get('surcharge');
        this.surcharge = surcharge?.value;

        const total_volume = form.get('total_volume');
        this.total_volume = total_volume?.value;

        const vat = form.get('vat');
        this.vat = vat?.value;

        const promotion_code = form.get('promotion_code');
        this.promotion_code = promotion_code?.value;

        const total_parcel = form.get('total_parcel');
        this.total_parcel = total_parcel?.value;

        const company_id = form.get('company_id');
        this.company_id = company_id?.value;

        const start_date = form.get('start_date');
        this.start_date = start_date?.value;

        const end_date = form.get('end_date');
        this.end_date = end_date?.value;

        const bill_state = form.get('bill_state');
        this.bill_state = bill_state?.value;

        const create_date = form.get('create_date');
        this.create_date = create_date?.value;

        const subscribe_name = form.get('subscribe_name');
        this.subscribe_name = subscribe_name?.value;

        const frequency = form.get('frequency');
        this.frequency = frequency?.value;

        const day_of_week = form.get('day_of_week');
        this.day_of_week = day_of_week?.value;

        const title_award_name = form.get('title_award_name');
        this.title_award_name = title_award_name?.value;

        const day_of_month = form.get('day_of_month');
        this.day_of_month = day_of_month?.value;

        const description = form.get('description');
        this.description = description?.value;

        const status = form.get('status');
        this.status = status?.value;
      }
    }
  }

}
