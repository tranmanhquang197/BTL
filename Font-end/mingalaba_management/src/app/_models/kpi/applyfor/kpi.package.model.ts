import {Kpi} from '../kpi.model';
import {Package} from '../../package.model';
import {Country} from '../../dcommerce/country.model';

export class KpiPackage {
  id?: number | null;
  kpi: Kpi | undefined | null;
  packageE: Package | undefined | null;

  constructor(kpiPackage: KpiPackage) {
    this.id = kpiPackage.id;
    this.kpi = kpiPackage.kpi;
    this.packageE = kpiPackage.packageE;
  }
}
