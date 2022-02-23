import {SuperEntity} from '@next-solutions/next-solutions-base';
import {Promotion} from './promotion.model';
import {FormGroup} from '@angular/forms';
import {PromotionLevelGroupMappingSellReward} from './promotion.level.group.mapping.sell.reward.model';

export class PromotionLevel extends SuperEntity {
  promotion: Promotion | undefined;
  code: string | undefined | null;
  description: string | undefined | null;
  promotionLevelGroupMappingSellRewards: PromotionLevelGroupMappingSellReward[] = [];
  isReducedReferenceCircle? = false; // to check logic, not store
  constructor(form: FormGroup | number) {
    super();
    if (form) {
      if (form instanceof FormGroup) {
        const fId = form.get('id');
        if (fId && fId.value) {
          this.id = fId.value;
        } else {
          this.id = null;
        }
        const fPromotion = form.get('promotion');
        if (fPromotion) {
          this.promotion = new Promotion(fPromotion.value);
        }
        const fCode = form.get('code');
        if (fCode) {
          this.code = fCode.value;
        }
        const fDescription = form.get('description');
        if (fDescription) {
          this.description = fDescription.value;
        }
      } else {
        this.id = form;
      }
    }
  }

  static reduceReferenceCircle(level: PromotionLevel | undefined) {
    if (!level) {
      return;
    }
    level.promotion = level.promotion?.id ? new Promotion(level.promotion.id) : undefined;
    level.promotionLevelGroupMappingSellRewards.forEach(mapping => {
      PromotionLevelGroupMappingSellReward.reduceReferenceCircle(mapping);
    })
  }
}
