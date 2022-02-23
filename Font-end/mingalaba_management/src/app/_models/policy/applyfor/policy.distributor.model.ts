import {Policy} from '../policy.model';

export class PolicyDistributor {
  id?: number;
  policy: Policy | undefined | null;
  distributorCode: string | undefined | null;
  distributorName: string | undefined | null;

  constructor(pd: PolicyDistributor) {
    this.id = pd.id;
    this.policy = (pd.policy && pd.policy.id) ? new Policy(pd.policy.id) : null;
    this.distributorCode = pd.distributorCode;
    this.distributorName = pd.distributorName;
  }
}
