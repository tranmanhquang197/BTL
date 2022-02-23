import {KpiStatusEnum} from '../../_models/kpi/enum/kpi.status.enum';
import {Kpi} from '../../_models/kpi/kpi.model';
import {environment} from '../../../environments/environment';
import {KpiTypeEnum} from '../../_models/kpi/enum/kpi.type.enum';

export class KpiRoleUtils {

  private static notApplyForPackageKpiType = [
    // KpiTypeEnum._KPI_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION,
    // KpiTypeEnum._KPI_NETWORK_EXPANSION_L2_L2_EXISTS_ON_SYSTEM,
    KpiTypeEnum._KPI_INVENTORY_QUANTITY,
    KpiTypeEnum._KPI_INVENTORY_AMOUNT
  ];

  static applyForPackage(kpi: Kpi | string | undefined) {
    if (typeof (kpi) === 'string') {
      return kpi === '' || (!!kpi && !this.notApplyForPackageKpiType.map(type => type.toString()).includes(kpi));
    }
    return !!kpi && !this.notApplyForPackageKpiType.map(type => type.toString()).includes(KpiTypeEnum['_' + kpi.type])
  }

  static isAcceptedKpi(kpi: Kpi | undefined | null): boolean {
    return !!kpi && KpiStatusEnum['_' + kpi.status] === KpiStatusEnum._ACCEPTED;
  }

  static isRejectedKpi(kpi: Kpi | undefined | null): boolean {
    return !!kpi && KpiStatusEnum['_' + kpi.status] === KpiStatusEnum._REJECTED;
  }

  static isDraftKpi(kpi: Kpi | undefined | null): boolean {
    return !!kpi && KpiStatusEnum['_' + kpi.status] === KpiStatusEnum._DRAFT;
  }

}
