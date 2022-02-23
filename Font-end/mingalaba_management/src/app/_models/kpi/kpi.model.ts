import {KpiDistributor} from './applyfor/kpi.distributor.model';
import {KpiManufacturer} from './applyfor/kpi.manufacturer.model';
import {KpiPackage} from './applyfor/kpi.package.model';
import {KpiProductPacking} from './applyfor/kpi.product.packing.model';
import {KpiStore} from './applyfor/kpi.store.model';
import {KpiTownship} from './applyfor/kpi.township.model';
import {KpiFile} from './kpi.file.model';
import {KpiPolicy} from './kpi.policy.model';
import {FormGroup} from '@angular/forms';
import {KpiLevel} from './applyfor/kpi.level.model';
import {KpiSegment} from './applyfor/kpi.segment.model';
import {SuperEntity, UploadModel} from "@next-solutions/next-solutions-base";

export class Kpi extends SuperEntity {
  id: number | undefined | null;
  clientId: string | undefined;
  type: string | undefined | null;
  code: string | undefined | null;
  fromDate: string | undefined;
  toDate: string | undefined;
  description: string | undefined | null;
  status: string | undefined | null;
  rejectReason: string | undefined | null;
  referenceKpi: Kpi | undefined | null;
  childKpis: Kpi[] | undefined | null;
  targetValue: number | undefined | null;
  kpiDistributors: KpiDistributor[] = [];
  kpiManufacturers: KpiManufacturer[] = [];
  kpiPackages: KpiPackage[] = [];
  kpiLevels: KpiLevel[] = [];
  kpiSegments: KpiSegment[] = [];
  kpiProductPackings: KpiProductPacking[] = [];
  kpiStores: KpiStore[] = [];
  kpiTownships: KpiTownship[] = [];
  kpiFiles: KpiFile[] = [];
  kpiPolicies: KpiPolicy[] = [];

  manufacturers: (string | undefined | null)[] | undefined;
  distributors: (string | undefined | null)[] | undefined;
  stores: (string | undefined | null)[] | undefined | null;
  townships: (string | undefined | null)[] | undefined | null;
  packages: (number | undefined | null)[] | undefined | null;
  levels: (number | undefined | null)[] | undefined | null;
  segments: (number | undefined | null)[] | undefined | null;
  productPackings: (string | undefined | null)[] | undefined | null;
  files: (any)[] | undefined | null;



  constructor(form: FormGroup | number | undefined | null) {
    super();
    if (form) {
      if (form instanceof FormGroup) {

        const fId = form.get('id');
        if (fId && fId.value) {
          this.id = Number(fId.value);
        }

        const fClientId = form.get('clientId');
        this.clientId = fClientId?.value;

        const fType = form.get('type');
        this.type = fType?.value;

        const fCode = form.get('code');
        this.code = fCode?.value;

        const fReferenceKpi = form.get('referenceKpi');
        if (fReferenceKpi && fReferenceKpi.value) {
          this.referenceKpi = new Kpi(fReferenceKpi.value);
        }

        const fFromDate = form.get('fromDate');
        this.fromDate = fFromDate?.value;

        const fToDate = form.get('toDate');
        this.toDate = fToDate?.value;

        const fStatus = form.get('status');
        if (fStatus && fStatus.value) {
          this.status = fStatus.value
        }

        const fDescription = form.get('description');
        if (fDescription && fDescription.value) {
          this.description = fDescription.value
        }

        const fTargetValue = form.get('targetValue');
        if (fTargetValue && fTargetValue.value) {
          this.targetValue = fTargetValue.value
        }

        const fKpiDistributors = form.get('kpiDistributors');
        if (fKpiDistributors && fKpiDistributors.value) {
          this.kpiDistributors = fKpiDistributors.value;
          this.kpiDistributors?.forEach(kpiDistributor =>
            kpiDistributor.kpi = kpiDistributor.kpi ? new Kpi(kpiDistributor?.kpi?.id) : null);
        }

        const fKpiManufacturers = form.get('kpiManufacturers');
        if (fKpiManufacturers && fKpiManufacturers.value) {
          this.kpiManufacturers = fKpiManufacturers.value;
          this.kpiManufacturers?.forEach(kpiManufacturer =>
            kpiManufacturer.kpi = kpiManufacturer.kpi ? new Kpi(kpiManufacturer.kpi.id) : null);
        }

        const fKpiPackages = form.get('kpiPackages');
        if (fKpiPackages && fKpiPackages.value) {
          this.kpiPackages = fKpiPackages.value;
          this.kpiPackages?.forEach(kpiPackage =>
            kpiPackage.kpi = kpiPackage.kpi ? new Kpi(kpiPackage.kpi.id) : null);
        }
        const fKpiLevels = form.get('kpiLevels');
        if (fKpiLevels && fKpiLevels.value) {
          this.kpiLevels = fKpiLevels.value;
          this.kpiLevels?.forEach(kl =>
            kl.kpi = kl.kpi ? new Kpi(kl.kpi.id) : null);
        }

        const fKpiSegments = form.get('kpiSegments');
        if (fKpiSegments && fKpiSegments.value) {
          this.kpiSegments = fKpiSegments.value;
          this.kpiSegments?.forEach(kl =>
            kl.kpi = kl.kpi ? new Kpi(kl.kpi.id) : null);
        }

        const fKpiProductPackings = form.get('kpiProductPackings');
        if (fKpiProductPackings && fKpiProductPackings.value) {
          this.kpiProductPackings = fKpiProductPackings.value;
          this.kpiProductPackings?.forEach(kpiProductPacking =>
            kpiProductPacking.kpi = kpiProductPacking.kpi ? new Kpi(kpiProductPacking.kpi.id) : null);
        }

        const fKpiStores = form.get('kpiStores');
        if (fKpiStores && fKpiStores.value) {
          this.kpiStores = fKpiStores.value;
          this.kpiStores?.forEach(kpiStore =>
            kpiStore.kpi = kpiStore.kpi ? new Kpi(kpiStore.kpi.id) : null);
        }

        const fKpiTownships = form.get('kpiTownships');
        if (fKpiTownships && fKpiTownships.value) {
          this.kpiTownships = fKpiTownships.value;
          this.kpiTownships?.forEach(kpiTownship => {
            kpiTownship.kpi = kpiTownship.kpi ? new Kpi(kpiTownship.kpi.id) : null;
            kpiTownship.township = null;
          });

        }

        const fKpiFiles = form.get('kpiFiles');
        if (fKpiFiles) {
          this.kpiFiles = fKpiFiles.value ? fKpiFiles.value : [];
          this.kpiFiles?.forEach(kpiFile =>
            kpiFile.kpi = kpiFile.kpi ? new Kpi(kpiFile.kpi.id) : null);
        }

        const fKpiPolicies = form.get('kpiPolicies');
        if (fKpiPolicies && fKpiPolicies.value) {
          this.kpiPolicies = fKpiPolicies.value;
          this.kpiPolicies?.forEach((kpiPolicy: KpiPolicy) =>
            kpiPolicy.kpi = kpiPolicy.kpi ? new Kpi(kpiPolicy.kpi.id) : null);
        }
      } else {
        this.id = isNaN(Number(form)) ? null : Number(form);
      }
    }

  }

}
