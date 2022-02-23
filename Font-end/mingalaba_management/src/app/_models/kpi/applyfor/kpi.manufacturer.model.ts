import {Kpi} from '../kpi.model';

export class KpiManufacturer {
  id?: number | null;
  kpi: Kpi | undefined | null;
  manufacturerCode: string | undefined | null;
  manufacturerName: string | undefined | null;

  constructor(kpiManufacturer: KpiManufacturer) {
    this.id = kpiManufacturer.id;
    this.kpi = kpiManufacturer.kpi;
    this.manufacturerName = kpiManufacturer.manufacturerName;
    this.manufacturerCode = kpiManufacturer.manufacturerCode;
  }
}
