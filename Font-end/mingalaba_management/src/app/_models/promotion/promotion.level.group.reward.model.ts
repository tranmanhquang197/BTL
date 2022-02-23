import {Promotion} from './promotion.model';
import {SuperEntity} from '@next-solutions/next-solutions-base';
import {PromotionLevel} from './promotion.level.model';
import {PromotionLevelGroupRewardProductPacking} from './promotion.level.group.reward.product.packing.model';
import {FormGroup} from "@angular/forms";

export class PromotionLevelGroupReward extends SuperEntity {
  promotion: Promotion | undefined | null;
  promotionLevel: PromotionLevel | undefined | null;
  maxQuantity: number | undefined | null;
  maxAmount: number | undefined | null;
  percent: number | undefined | null;
  promotionLevelGroupRewardProductPackings: PromotionLevelGroupRewardProductPacking[] = [];
  parityLevel?: number | null;

  constructor(form?: FormGroup | number) {
    super();
    if (form instanceof FormGroup) {

    } else {
      this.id = form;
    }
  }

  static reduceReferenceCircle(groupReward: PromotionLevelGroupReward | undefined) {
    if (!groupReward) {
      return;
    }
    groupReward.promotion = groupReward.promotion?.id ? new Promotion(groupReward.promotion.id) : undefined;
    groupReward.promotionLevel = groupReward.promotionLevel?.id ? new PromotionLevel(groupReward.promotionLevel.id) : undefined;
    groupReward.promotionLevelGroupRewardProductPackings.forEach(ppReward => {
      PromotionLevelGroupRewardProductPacking.reduceReferenceCircle(ppReward);
    })
  }
}
