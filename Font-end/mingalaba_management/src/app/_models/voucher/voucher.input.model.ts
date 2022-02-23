import { CreateFileInput } from './file.input.model';
import { FormGroup } from '@angular/forms';

export class VoucherInput {
  title: string | undefined;
  voucher_type_id: number | undefined;
  description: string | undefined;
  quantity: number | undefined;
  user_id: number | undefined;
  file: CreateFileInput | undefined;
  from_date: string | undefined;
  to_date: string | undefined;
  published_date: string | undefined;
  age_from?: number | undefined;
  age_to?: number | undefined;
  gender: string | undefined;
  hobbies?: number[] | undefined;
  hobbiesNew?: string[] | undefined;
  other_information?: string | undefined;
  customer?: number[] | undefined;
  address: number[] | undefined;


  constructor(form: FormGroup | number | undefined | null | any) {
    if (form) {
      if (form instanceof FormGroup) {
        const fType = form.get('type');
        if (fType) {
          this.voucher_type_id = Number(fType.value);
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
          const tmpFromDate = new Date(fFromDate.value).toISOString();
          this.from_date = tmpFromDate;
        }
        const fToDate = form.get('to_date');
        if (fToDate) {
          const tmpToDate = new Date(fToDate.value).toISOString();
          this.to_date = tmpToDate;
        }
        const fPublishedDate = form.get('published_date');
        if (fPublishedDate) {
          const tmpPublishedDate = new Date(fPublishedDate.value).toISOString();
          this.published_date = tmpPublishedDate;

        }
        const fGender = form.get('gender');
        if (fGender) {
          this.gender = fGender.value;
        }

        const fAgeFrom = form.get('age_from');
        if (fAgeFrom) {
          this.age_from = Number(fAgeFrom.value);
        }

        const fAgeTo = form.get('age_to');
        if (fAgeTo) {
          this.age_to = Number(fAgeTo.value);
        }

        const fHobbies = form.get('hobbies');
        if (fHobbies?.value !== '') {
          this.hobbies = fHobbies?.value;
        } else {
          this.hobbies = [];
        }

        const fAddres = form.get('address');
        if (fAddres?.value !== '') {
          this.address = fAddres?.value;
        } else {
          this.address = [];
        }

        const fOtherInformation = form.get('other_information');
        if (fOtherInformation) {
          this.other_information = fOtherInformation.value;
        }

        const customer = form.get('customer');
        if (customer) {
          this.customer = customer.value;
        }

        const fQuantity = form.get('quantity');
        if (fQuantity) {
          this.quantity = Number(fQuantity.value);
        }

        const fTownship = form.get('township');
        const fDistricts = form.get('district');
        if (fTownship?.value?.length > 0 && fDistricts?.value) {
          this.address = fTownship?.value;
        } else if (fDistricts?.value && fTownship?.value.length === 0) {
          this.address = [fDistricts.value];
        } else {
          this.address = [];
        }

      }
    }
  }
}
