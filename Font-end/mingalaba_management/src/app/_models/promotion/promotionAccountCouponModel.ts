import {Promotion} from './promotion.model';

export class PromotionAccountCouponModel {
  id: number | undefined;
  promotion: Promotion;
  maximumNumberOfTurns: number | undefined;
  username: string | undefined;

  constructor(promotionId: number, username?: string) {
    this.promotion = new Promotion(promotionId);
    this.username = username;
  }

}
