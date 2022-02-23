import {Kpi} from '../kpi.model';
import {Segment} from '../../segment.model';

export class KpiSegment {
  id?: number | null;
  kpi: Kpi | undefined | null;
  segment: Segment | undefined | null;

  constructor(ks: KpiSegment) {
    this.id = ks.id;
    this.kpi = ks.kpi;
    this.segment = ks.segment;
  }
}
