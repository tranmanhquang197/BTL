import {Kpi} from '../kpi/kpi.model';
import {Policy} from './policy.model';

export class PolicyDetail {

  static AMOUNT_REWARD_UNIT = 'MMK';
  static PERCENT_REWARD_UNIT = '%';
  static POINT_REWARD_UNIT = 'POINT';

  id: number | undefined | null;
  kpi: Kpi | undefined | null;
  minValue: number | undefined | null;
  policy: Policy | null | undefined;
  rewardUnit: string | undefined | null;
  rewardValue: number | undefined | null;

  constructor(policy: Policy | undefined) {
    if (policy) {
      this.policy = policy;
      if (policy.kpi) {
        this.kpi = new Kpi(policy.kpi.id);
      }
    }

  }
}
