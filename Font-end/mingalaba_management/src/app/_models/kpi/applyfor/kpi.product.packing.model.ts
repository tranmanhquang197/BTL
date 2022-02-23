import {Kpi} from '../kpi.model';
import {Country} from '../../dcommerce/country.model';

export class KpiProductPacking {
  id?: number | null;
  kpi: Kpi | undefined | null;
  productPackingCode: string | undefined | null;
  productPackingName: string | undefined | null;

  constructor(kpp: KpiProductPacking) {
    this.id = kpp.id;
    this.kpi = kpp.kpi;
    this.productPackingName = kpp.productPackingName;
    this.productPackingCode = kpp.productPackingCode;
  }
}
