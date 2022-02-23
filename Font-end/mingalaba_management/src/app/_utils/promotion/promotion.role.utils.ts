import {PromotionStatusEnum} from '../../_models/promotion/enums/promotion.status.enum';
import {Promotion} from '../../_models/promotion/promotion.model';

export class PromotionRoleUtils {
  static isAcceptedPromotion(promotion: Promotion | null | undefined): boolean {
    return !!promotion && PromotionStatusEnum['_' + promotion.status] === PromotionStatusEnum._ACCEPTED;
  }

  static isRejectedPromotion(promotion: Promotion | null | undefined): boolean {
    return !!promotion && PromotionStatusEnum['_' + promotion.status] === PromotionStatusEnum._REJECTED;
  }

  static isDraftPromotion(promotion: Promotion | null | undefined): boolean {
    return !!promotion && PromotionStatusEnum['_' + promotion.status] === PromotionStatusEnum._DRAFT;
  }
}
