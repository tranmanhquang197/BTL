import {Policy} from '../policy.model';
import {Segment} from '../../segment.model';

export class PolicySegment {
  id?: number;
  policy: Policy | undefined | null;
  segment: Segment | undefined | null;

  constructor(ps: PolicySegment) {
    this.id = ps.id;
    this.policy = (ps.policy && ps.policy.id) ? new Policy(ps.policy.id) : null;
    this.segment = ps.segment;
  }
}
