import {Kpi} from '../kpi.model';
import {Country} from '../../dcommerce/country.model';

export class KpiStore {
  id?: number | null;
  kpi: Kpi | undefined | null;
  storeCode: string | undefined | null;
  storeName: string | undefined | null;

  constructor(kpiStore: KpiStore) {
    this.id = kpiStore.id;
    this.kpi = kpiStore.kpi;
    this.storeName = kpiStore.storeName;
    this.storeCode = kpiStore.storeCode;
  }
}
