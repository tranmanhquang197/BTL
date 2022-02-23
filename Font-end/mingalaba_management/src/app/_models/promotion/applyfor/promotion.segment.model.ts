import {Segment} from '../../segment.model';
import {Promotion} from '../promotion.model';

export class PromotionSegment {
  id?: number | null;
  promotion: Promotion | undefined | null;
  segment: Segment | undefined | null;

  constructor(ps: PromotionSegment) {
    this.id = ps.id;
    this.promotion = ps.promotion;
    this.segment = ps.segment;
  }
}
