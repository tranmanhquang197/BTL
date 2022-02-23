import {Kpi} from '../../_models/kpi/kpi.model';
import {SelectModel} from '@next-solutions/next-solutions-base';
import {KpiPackage} from '../../_models/kpi/applyfor/kpi.package.model';
import {KpiLevel} from '../../_models/kpi/applyfor/kpi.level.model';
import {KpiSegment} from '../../_models/kpi/applyfor/kpi.segment.model';
import {KpiDistributor} from '../../_models/kpi/applyfor/kpi.distributor.model';
import {KpiManufacturer} from '../../_models/kpi/applyfor/kpi.manufacturer.model';
import {KpiProductPacking} from '../../_models/kpi/applyfor/kpi.product.packing.model';
import {KpiTownship} from '../../_models/kpi/applyfor/kpi.township.model';
import {KpiStore} from '../../_models/kpi/applyfor/kpi.store.model';

export class KpiUtils {
  static setKpiApplyFor(editedKpi: Kpi, parentKpi: Kpi,
                        bonusSetParam: { productPackingOptions?: SelectModel[] }): Kpi {
    if ((!editedKpi.kpiPackages || editedKpi.kpiPackages.length === 0) && parentKpi.kpiPackages.length > 0) {
      editedKpi.kpiPackages = parentKpi.kpiPackages.map((kp: KpiPackage) => new KpiPackage(
        {
          packageE: kp.packageE,
          kpi: (editedKpi && editedKpi.id) ? new Kpi(editedKpi.id) : null
        }));
    }

    if ((!editedKpi.kpiLevels || editedKpi.kpiLevels.length === 0) && parentKpi.kpiLevels.length > 0) {
      editedKpi.kpiLevels = parentKpi.kpiLevels.map((kp: KpiLevel) => new KpiLevel(
        {
          level: kp.level,
          kpi: (editedKpi && editedKpi.id) ? new Kpi(editedKpi.id) : null
        }));
    }

    if ((!editedKpi.kpiSegments || editedKpi.kpiSegments.length === 0) && parentKpi.kpiSegments.length > 0) {
      editedKpi.kpiSegments = parentKpi.kpiSegments.map((kp: KpiSegment) => new KpiSegment(
        {
          segment: kp.segment,
          kpi: (editedKpi && editedKpi.id) ? new Kpi(editedKpi.id) : null
        }));
    }

    if ((!editedKpi.kpiDistributors || editedKpi.kpiDistributors.length === 0) && parentKpi.kpiDistributors.length > 0) {
      editedKpi.kpiDistributors = parentKpi.kpiDistributors.map((kd: KpiDistributor) => new KpiDistributor(
        {
          distributorCode: kd.distributorCode,
          distributorName: kd.distributorName,
          kpi: (editedKpi && editedKpi.id) ? new Kpi(editedKpi.id) : null
        }));
    }

    if ((!editedKpi.kpiManufacturers || editedKpi.kpiManufacturers.length === 0) && parentKpi.kpiManufacturers.length > 0) {
      editedKpi.kpiManufacturers = parentKpi.kpiManufacturers
        .map((km: KpiManufacturer) => new KpiManufacturer(
          {
            manufacturerCode: km.manufacturerCode,
            manufacturerName: km.manufacturerName,
            kpi: (editedKpi && editedKpi.id) ? new Kpi(editedKpi.id) : null
          }));
    }
    if ((!editedKpi.kpiProductPackings || editedKpi.kpiProductPackings.length === 0) && parentKpi.kpiProductPackings.length > 0) {
      editedKpi.kpiProductPackings = bonusSetParam.productPackingOptions && bonusSetParam.productPackingOptions.length > 0
        ? bonusSetParam.productPackingOptions.map(pp => new KpiProductPacking(
          {
            productPackingCode: pp.rawData.code,
            productPackingName: pp.rawData.productDescription.productName,
            kpi: (editedKpi && editedKpi.id) ? new Kpi(editedKpi.id) : null
          }))
        : parentKpi.kpiProductPackings
          .map(kpp => new KpiProductPacking(
            {
              productPackingCode: kpp.productPackingCode,
              productPackingName: kpp.productPackingName,
              kpi: (editedKpi && editedKpi.id) ? new Kpi(editedKpi.id) : null
            }));
    }
    if ((!editedKpi.kpiTownships || editedKpi.kpiTownships.length === 0) && parentKpi.kpiTownships.length > 0) {
      editedKpi.kpiTownships = parentKpi.kpiTownships
        .map(kt => new KpiTownship(
          {
            townshipCode: kt.townshipCode,
            townshipName: kt.townshipName,
            kpi: (editedKpi && editedKpi.id) ? new Kpi(editedKpi.id) : null
          }));
    }
    if ((!editedKpi.kpiStores || editedKpi.kpiStores.length === 0) && parentKpi.kpiStores.length > 0) {
      editedKpi.kpiStores = parentKpi.kpiStores
        .map(kt => new KpiStore(
          {
            storeCode: kt.storeCode,
            storeName: kt.storeName,
            kpi: (editedKpi && editedKpi.id) ? new Kpi(editedKpi.id) : null
          }));
    }

    return editedKpi;
  }

}
