import {Promotion} from "./promotion.model";
import {SuperEntity} from '@next-solutions/next-solutions-base';
import {PromotionLevel} from "./promotion.level.model";
import {PromotionLevelGroupSellProductPacking} from "./promotion.level.group.sell.product.packing.model";
import {FormGroup} from "@angular/forms";

export class PromotionLevelGroupSell extends SuperEntity {
  promotion: Promotion | undefined | null;
  promotionLevel: PromotionLevel | undefined | null;
  minQuantity: number | undefined | null;
  minAmount: number | undefined | null;

  numberOfMerchant?: number | null;
  percentOfMerchantSell?: number | null;
  amountOfMerchantSell?: number | null;

  promotionLevelGroupSellProductPackings: PromotionLevelGroupSellProductPacking[] = [];

  constructor(form?: FormGroup | number) {
    super();
    if (form instanceof FormGroup) {

    } else {
      this.id = form;
    }

  }

  static reduceReferenceCircle(groupSell: PromotionLevelGroupSell | undefined) {
    if (!groupSell) {
      return;
    }
    groupSell.promotion = groupSell.promotion?.id ? new Promotion(groupSell.promotion.id) : undefined;
    groupSell.promotionLevel = groupSell.promotionLevel?.id ? new PromotionLevel(groupSell.promotionLevel.id) : undefined;
    groupSell.promotionLevelGroupSellProductPackings.forEach(ppSell => {
      PromotionLevelGroupSellProductPacking.reduceReferenceCircle(ppSell);
    })
  }
}
