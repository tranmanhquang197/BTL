import {Kpi} from '../kpi.model';

export class KpiDistributor {
  id?: number | null;
  kpi: Kpi | undefined | null;
  distributorCode: string | undefined | null;
  distributorName: string | undefined | null;

  constructor(kpiDistributor: KpiDistributor) {
    this.id = kpiDistributor.id;
    this.kpi = kpiDistributor.kpi;
    this.distributorCode = kpiDistributor.distributorCode;
    this.distributorName = kpiDistributor.distributorName;
  }
}
