import {Policy} from '../policy.model';

export class PolicyStore {
  id?: number;
  policy: Policy | undefined | null;
  storeCode: string | undefined | null;
  storeName: string | undefined | null;

  constructor(ps: PolicyStore) {
    this.id = ps.id;
    this.policy = (ps.policy && ps.policy.id) ? new Policy(ps.policy.id) : null;
    this.storeCode = ps.storeCode;
    this.storeName = ps.storeName;
  }
}
