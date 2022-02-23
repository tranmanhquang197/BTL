import {PromotionLevel} from '../promotion/promotion.level.model';
import {Mch} from '../dcommerce/mch.model';

export class AddEditPromotionLevelGroupMappingSellRewardDialogModel {
  promotionLevel: PromotionLevel;
  mchs: Mch[];

  constructor(promotionLevel: PromotionLevel, mchs: Mch[]) {
    this.promotionLevel = promotionLevel;
    this.mchs = mchs;
  }
}
