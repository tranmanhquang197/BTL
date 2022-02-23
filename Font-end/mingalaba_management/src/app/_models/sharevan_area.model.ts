import { SuperEntity } from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';

export class Sharevan_areaModel extends SuperEntity {
  id: number | undefined | null;
  country_id: number | undefined | null;
  name: string | undefined | null;
  province_name: string | undefined | null;
  zone_area_id: number | undefined | null;
  name_seq: string | undefined | null;
  zoneInfo: string | undefined | null;
  location_type: string | undefined | null;
  parent_id: number | undefined | null;
  district_name: string | undefined | null;
  google_name: string | undefined | null;
  status: string | undefined | null;
  hub_id: null | undefined | null;
  hubInfo: string | undefined | null;

  constructor(form: FormGroup | number) {
    super();
    if (form instanceof FormGroup) {
      const fId = form.get('id');
      if (fId) {
        this.id = fId?.value;
      }
      const fname = form.get('name');
      if (fname) {
        this.name = fname?.value;
      }
      const fCountry_id = form.get('country_id');
      if (fCountry_id) {
        this.country_id = fCountry_id?.value;
      }
      const fPovince_name = form.get('province_name');
      if (fPovince_name) {
        this.province_name = fPovince_name?.value;
      }
      const fZone_area_id = form.get('zone_area_id');
      if (fZone_area_id) {
        this.zone_area_id = fZone_area_id?.value;
      }
      const fName_seq = form.get('name_seq');
      if (fName_seq) {
        this.name_seq = fName_seq?.value;
      }
      const fZoneInfo = form.get('zoneInfo');
      if (fZoneInfo) {
        this.zoneInfo = fZoneInfo?.value;
      }
      const fLocation_type = form.get('location_type');
      if (fLocation_type) {
        this.status = fLocation_type?.value;
      }
      const fParent_id = form.get('parent_id');
      if (fParent_id) {
        this.parent_id = fParent_id?.value;
      }
      const fDistrict_name = form.get('district_name');
      if (fDistrict_name) {
        this.district_name = fDistrict_name?.value;
      }
      const fGoogle_name = form.get('google_name');
      if (fGoogle_name) {
        this.google_name = fGoogle_name?.value;
      }
      const fHub_id = form.get('hub_id');
      if (fHub_id) {
        this.hub_id = fHub_id?.value;
      }
      const fHubInfo = form.get('hubInfo');
      if (fHubInfo) {
        this.hubInfo = fHubInfo?.value;
      }
      const fStatus = form.get('status');
      if (fStatus) {
        this.status = fStatus?.value;
      }
    } else {
      this.id = form;
    }
  }
}
