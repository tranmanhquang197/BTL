import {CountryLocation} from '../../dcommerce/country.location.model';
import {Policy} from '../policy.model';

export class PolicyTownship {
  id?: number;
  policy: Policy | undefined | null;
  townshipCode: string | undefined | null;
  townshipName: string | undefined | null;
  township?: CountryLocation;

  constructor(pt: PolicyTownship) {
    this.id = pt.id;
    this.policy = (pt.policy && pt.policy.id) ? new Policy(pt.policy.id) : null;
    this.townshipCode = pt.townshipCode;
    this.townshipName = pt.townshipName;
  }
}
