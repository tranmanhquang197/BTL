import {Policy} from '../policy.model';

export class PolicyProductPacking {
  id?: number;
  policy: Policy | undefined | null;
  productPackingCode: string | undefined | null;
  productPackingName: string | undefined | null;

  constructor(ppp: PolicyProductPacking) {
    this.id = ppp.id;
    this.policy = (ppp.policy && ppp.policy.id) ? new Policy(ppp.policy.id) : null;
    this.productPackingCode = ppp.productPackingCode;
    this.productPackingName = ppp.productPackingName;
  }
}
