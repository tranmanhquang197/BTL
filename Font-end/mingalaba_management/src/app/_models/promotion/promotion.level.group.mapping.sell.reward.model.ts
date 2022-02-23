import {SuperEntity} from '@next-solutions/next-solutions-base';
import {Promotion} from './promotion.model';
import {PromotionLevel} from './promotion.level.model';
import {PromotionLevelGroupSell} from './promotion.level.group.sell.model';
import {PromotionLevelGroupReward} from './promotion.level.group.reward.model';

export class PromotionLevelGroupMappingSellReward extends SuperEntity {
  promotion?: Promotion;
  promotionLevel?: PromotionLevel;
  promotionLevelGroupSell: PromotionLevelGroupSell | undefined;
  promotionLevelGroupReward: PromotionLevelGroupReward | undefined;

  static reduceReferenceCircle(mapping: PromotionLevelGroupMappingSellReward) {
    mapping.promotion = mapping.promotion?.id ? new Promotion(mapping.promotion.id) : undefined;
    mapping.promotionLevel = mapping.promotionLevel?.id ? new PromotionLevel(mapping.promotionLevel.id) : undefined;
    PromotionLevelGroupSell.reduceReferenceCircle(mapping.promotionLevelGroupSell);
    PromotionLevelGroupReward.reduceReferenceCircle(mapping.promotionLevelGroupReward);
  }
}
