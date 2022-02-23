import {Promotion} from './promotion.model';

export class PromotionFlashSaleRangeTimeModel {
  fromTime: string | undefined | null;
  id: number | undefined | null;
  promotion: Promotion | undefined | null;
  toTime: string | undefined | null;
}
