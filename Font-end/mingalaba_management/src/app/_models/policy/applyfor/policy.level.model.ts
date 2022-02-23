import {Policy} from '../policy.model';
import {Level} from '../../level/level.model';

export class PolicyLevel {
  id?: number;
  policy: Policy | undefined | null;
  level: Level | undefined | null;

  constructor(pl: PolicyLevel) {
    this.id = pl.id;
    this.policy = (pl.policy && pl.policy.id) ? new Policy(pl.policy.id) : null;
    this.level = pl.level;
  }
}
