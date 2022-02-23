import {Policy} from '../policy.model';

export class PolicyManufacturer {
  id?: number;
  policy: Policy | undefined | null;
  manufacturerCode: string | undefined | null;
  manufacturerName: string | undefined | null;


  constructor(pm: PolicyManufacturer) {
    this.id = pm.id;
    this.policy = (pm.policy && pm.policy.id) ? new Policy(pm.policy.id) : null;
    this.manufacturerCode = pm.manufacturerCode;
    this.manufacturerName = pm.manufacturerName;
  }
}
