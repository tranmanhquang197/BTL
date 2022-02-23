import { SuperEntity, UploadModel } from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';

export class WarehouseModel extends SuperEntity {
  id: number | undefined | null;
  name: string | undefined;
  name_seq: string | undefined;
  warehouse_code: string | undefined | null;
  address: string | undefined | null;
  street: string | undefined;
  street2: string | undefined;
  city_name: number | undefined;
  state_id: number | undefined;
  district: number | undefined;
  ward: number | undefined;
  zip: number | undefined;
  country_id: number | undefined;
  open_time: number | undefined;
  closing_time: number | undefined;
  capacity: number | undefined;
  available_capacity: number | undefined;
  customer_id: number | undefined;
  status: string | undefined;
  province_name: string | undefined;
  district_name: string | undefined;
  ward_name: string | undefined;


  constructor(form: FormGroup | number | undefined | null) {
    super();
    if (form) {
      if (form instanceof FormGroup) {
        const fId = form.get('id');
        if (fId) {
          this.id = fId?.value;
        }
        const fName_seq = form.get('name_seq');
        if (fName_seq) {
          this.name_seq = fName_seq?.value;
        }
        const fWarehouse_code = form.get('warehouse_code');
        if (fWarehouse_code) {
          this.warehouse_code = fWarehouse_code?.value;
        }
        const fAddress = form.get('address');
        if (fAddress) {
          this.address = fAddress?.value;
        }
        const fStreet = form.get('street');
        if (fStreet) {
          this.street = fStreet?.value;
        }
        const fStreet2 = form.get('street2');
        if (fStreet2) {
          this.street2 = fStreet2?.value;
        }
        const fCity_name = form.get('city_name');
        if (fCity_name) {
          this.city_name = fCity_name?.value;
        }
        const fState_id = form.get('state_id');
        if (fState_id) {
          this.state_id = fState_id?.value;
        }
        const fDistrict = form.get('district');
        if (fDistrict) {
          this.district = fDistrict?.value;
        }
        const fWard = form.get('ward');
        if (fWard) {
          this.ward = fWard?.value;
        }
        const fZip = form.get('zip');
        if (fZip) {
          this.zip = fZip?.value;
        }
        const fCountry_id = form.get('country_id');
        if (fCountry_id) {
          this.country_id = fCountry_id?.value;
        }
        const fOpen_time = form.get('open_time');
        if (fOpen_time) {
          this.open_time = fOpen_time?.value;
        }
        const fname = form.get('country_id');
        if (fname) {
          this.country_id = fname?.value;
        }
        const fname = form.get('closing_time');
        if (fname) {
          this.closing_time = fname?.value;
        }
        const fname = form.get('capacity');
        if (fname) {
          this.capacity = fname?.value;
        }
        const fname = form.get('available_capacity');
        if (fname) {
          this.available_capacity = fname?.value;
        }
        const fname = form.get('customer_id');
        if (fname) {
          this.customer_id = fname?.value;
        }
        const fname = form.get('status');
        if (fname) {
          this.status = fname?.value;
        }
        const fname = form.get('province_name');
        if (fname) {
          this.province_name = fname?.value;
        }
        const fname = form.get('customer_id');
        if (fname) {
          this.customer_id = fname?.value;
        }
        const fname = form.get('district_name');
        if (fname) {
          this.district_name = fname?.value;
        }
        const fname = form.get('ward_name');
        if (fname) {
          this.ward_name = fname?.value;
        }


      }
    }
  }

}
