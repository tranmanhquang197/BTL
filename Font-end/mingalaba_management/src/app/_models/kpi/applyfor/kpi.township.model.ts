import {Kpi} from '../kpi.model';
import {CountryLocation} from '../../dcommerce/country.location.model';

export class KpiTownship {
  id?: number | null;
  kpi: Kpi | undefined | null;
  townshipCode: string | undefined | null;
  townshipName: string | undefined | null;
  township?: CountryLocation | undefined | null;

  constructor(kpiTownship: KpiTownship) {
    this.id = kpiTownship.id;
    this.kpi = kpiTownship.kpi;
    this.townshipCode = kpiTownship.townshipCode;
    this.townshipName = kpiTownship.townshipName;
  }
}
