import {PolicyManufacturer} from './applyfor/policy.manufacturer.model';
import {PolicyPackage} from './applyfor/policy.package.model';
import {PolicyProductPacking} from './applyfor/policy.product.packing.model';
import {PolicyStore} from './applyfor/policy.store.model';
import {PolicyTownship} from './applyfor/policy.township.model';
import {FormGroup} from '@angular/forms';
import {Kpi} from '../kpi/kpi.model';
import {PolicyDetail} from './policy.detail.model';
import {PolicyDistributor} from './applyfor/policy.distributor.model';
import {PolicyLevel} from './applyfor/policy.level.model';
import {PolicySegment} from './applyfor/policy.segment.model';
import {PolicyFile} from './policy.file.model';

export class Policy {
  id: number | undefined | null;
  code: string | undefined | null;
  description: string | undefined | null;
  fromDate: string | undefined | null;
  toDate: string | undefined;
  type: string | undefined | null;
  kpi: Kpi | undefined | null;
  policyDetails: PolicyDetail[] = [];
  policyDistributors: PolicyDistributor[] = [];
  policyManufacturers: PolicyManufacturer[] = [];
  policyPackages: PolicyPackage[] = [];
  policyLevels: PolicyLevel[] = [];
  policySegments: PolicySegment[] = [];
  policyProductPackings: PolicyProductPacking[] = [];
  policyStores: PolicyStore[] = [];
  policyTownships: PolicyTownship[] = [];
  policyFiles: PolicyFile[] = [];

  menuType: string | undefined; // to display in client
  manufacturers: (string | undefined | null)[] | undefined | null;
  distributors: (string | undefined | null)[] | undefined | null;
  stores: (string | undefined | null)[] | undefined | null;
  townships: (string | undefined | null)[] | undefined | null;
  packages: (number | undefined | null)[] | undefined | null;
  levels: (number | undefined | null)[] | undefined | null;
  segments: (number | undefined | null)[] | undefined | null;
  productPackings: (string | undefined | null)[] | undefined | null;
  files: (any)[] | undefined | null;

  constructor(form: FormGroup | number | undefined | null) {
    if (form){
      if (form instanceof FormGroup) {

        const fId = form.get('id');
        if (fId && fId.value) {
          this.id = fId.value
        }

        const fType = form.get('type');
        this.type = fType?.value;

        const fCode = form.get('code');
        this.code = fCode?.value;

        const fFromDate = form.get('fromDate');
        this.fromDate = fFromDate?.value;

        const fToDate = form.get('toDate');
        this.toDate = fToDate?.value;

        const fKpi = form.get('kpi');
        if (fKpi && fKpi.value) {
          this.kpi = fKpi.value ? new Kpi(fKpi.value) : null;
        }

        const fPolicyDetails = form.get('policyDetails');
        if (fPolicyDetails && fPolicyDetails.value) {
          this.policyDetails = fPolicyDetails.value;
          this.policyDetails?.forEach((detail:PolicyDetail) => {
            detail.kpi = detail.kpi ? new Kpi(detail.kpi.id) : null;
            detail.policy = detail.policy ? new Policy(detail.policy.id) : null;
          })
        }

        const fDescription = form.get('description');
        if (fDescription && fDescription.value) {
          this.description = fDescription.value
        }

        const fPolicyDistributors = form.get('policyDistributors');
        if (fPolicyDistributors && fPolicyDistributors.value) {
          this.policyDistributors = fPolicyDistributors.value;
          this.policyDistributors.forEach(policyDistributor =>
            policyDistributor.policy = policyDistributor.policy ? new Policy(policyDistributor.policy.id) : null);
        }

        const fPolicyManufacturers = form.get('policyManufacturers');
        if (fPolicyManufacturers && fPolicyManufacturers.value) {
          this.policyManufacturers = fPolicyManufacturers.value;
          this.policyManufacturers.forEach(policyManufacturer =>
            policyManufacturer.policy = policyManufacturer.policy ? new Policy(policyManufacturer.policy.id) : null);
        }

        const fPolicyPackages = form.get('policyPackages');
        if (fPolicyPackages && fPolicyPackages.value) {
          this.policyPackages = fPolicyPackages.value;
          this.policyPackages.forEach(policyPackage =>
            policyPackage.policy = policyPackage.policy ? new Policy(policyPackage.policy.id) : null);
        }

        const fPolicyLevels = form.get('policyLevels');
        if (fPolicyLevels && fPolicyLevels.value) {
          this.policyLevels = fPolicyLevels.value;
          this.policyLevels.forEach(policyLevel =>
            policyLevel.policy = policyLevel.policy ? new Policy(policyLevel.policy.id) : null);
        }

        const fPolicySegments = form.get('policySegments');
        if (fPolicySegments && fPolicySegments.value) {
          this.policySegments = fPolicySegments.value;
          this.policySegments.forEach(policySegment =>
            policySegment.policy = policySegment.policy ? new Policy(policySegment.policy.id) : null);
        }

        const fPolicyProductPackings = form.get('policyProductPackings');
        if (fPolicyProductPackings && fPolicyProductPackings.value) {
          this.policyProductPackings = fPolicyProductPackings.value;
          this.policyProductPackings.forEach(policyProductPacking =>
            policyProductPacking.policy = policyProductPacking.policy ? new Policy(policyProductPacking.policy.id) : null);
        }

        const fPolicyStores = form.get('policyStores');
        if (fPolicyStores && fPolicyStores.value) {
          this.policyStores = fPolicyStores.value;
          this.policyStores.forEach(policyStore =>
            policyStore.policy = policyStore.policy ? new Policy(policyStore.policy.id) : null);
        }

        const fPolicyTownships = form.get('policyTownships');
        if (fPolicyTownships && fPolicyTownships.value) {
          this.policyTownships = fPolicyTownships.value;
          this.policyTownships.forEach(policyTownship => {
            policyTownship.policy = policyTownship.policy ? new Policy(policyTownship.policy.id) : null;
            // policyTownship.township = null;
          });

        }

        const fPolicyFiles = form.get('policyFiles');
        if (fPolicyFiles && fPolicyFiles.value) {
          this.policyFiles = fPolicyFiles.value;
          this.policyFiles.forEach(policyFile =>
            policyFile.policy = policyFile.policy ? new Policy(policyFile.policy.id) : undefined);
        }

      } else {
        this.id = form;
      }
    }

  }

}
