import {Package} from '../../package.model';
import {Policy} from '../policy.model';

export class PolicyPackage {
  id?: number;
  policy: Policy | undefined | null;
  packageE: Package | undefined | null;

  constructor(pp: PolicyPackage) {
    this.id = pp.id;
    this.policy = (pp.policy && pp.policy.id) ? new Policy(pp.policy.id) : null;
    this.packageE = pp.packageE;
  }
}
