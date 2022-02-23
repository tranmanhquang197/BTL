import {Promotion} from '../../_models/promotion/promotion.model';
import {SelectModel} from '@next-solutions/next-solutions-base';
import {PriceType} from '../../_models/enums/price.type.enum';
import {PriceStatusEnum} from '../../_models/enums/price.status.enum';
import {ProductPackingPrice} from '../../_models/dcommerce/product.packing.price.model';
import {ProductPacking} from '../../_models/dcommerce/product.packing.model';
import {MStoreCampaignModel} from "../../_models/mstore-campaign/mstore-campaign.model";

export class PromotionUtils {
  static filterSellPriceAvailable(promotion: Promotion, selectModelPacking: SelectModel) {
    if (promotion) {
      let fromDatePrice: Date;
      let toDatePrice: Date;
      let fromDatePromotion: Date;
      let toDatePromotion: Date;
      let hasOnePriceInPromotionTime: boolean;
      const defaultToDate = new Date(9999, 12, 31);
      const defaultFromDate = new Date(1900, 1, 1);
      return selectModelPacking.rawData.packingPrice.filter((price: ProductPackingPrice) => {
        fromDatePrice = !!price.fromDate ? new Date((price.fromDate && price.fromDate.endsWith('Z'))
          ? price.fromDate.replace('Z', '') : price.fromDate) : defaultFromDate;
        toDatePrice = !!price.toDate ? new Date(price.toDate.endsWith('Z')
          ? price.toDate.replace('Z', '') : price.toDate) : defaultToDate;

        fromDatePromotion = !!promotion.fromDate ? new Date(promotion.fromDate.endsWith('Z')
          ? promotion.fromDate.replace('Z', '') : promotion.fromDate) : defaultFromDate;
        toDatePromotion = !!promotion.toDate ? new Date(promotion.toDate.endsWith('Z')
          ? promotion.toDate.replace('Z', '') : promotion.toDate) : defaultToDate;

        hasOnePriceInPromotionTime = fromDatePrice.getTime() <= fromDatePromotion.getTime()
          && toDatePrice.getTime() >= toDatePromotion.getTime();

        return !!price.currencyCode && price.currencyCode.toLowerCase() === 'MMK'.toLowerCase()
          && hasOnePriceInPromotionTime && price.priceType === PriceType._OUT
          && price.status === PriceStatusEnum._APPROVED;
      });
    }

  }

  static filterSellPriceAvailableV2(promotion: Promotion | undefined | MStoreCampaignModel, productPacking: ProductPacking) {
    if (promotion) {
      let fromDatePrice: Date;
      let toDatePrice: Date;
      let fromDatePromotion: Date;
      let toDatePromotion: Date;
      let hasOnePriceInPromotionTime: boolean;
      const defaultToDate = new Date(9999, 12, 31);
      const defaultFromDate = new Date(1900, 1, 1);
      return productPacking.packingPrice?.filter((price: ProductPackingPrice) => {
        fromDatePrice = !!price.fromDate ? new Date((price.fromDate && price.fromDate.endsWith('Z'))
          ? price.fromDate.replace('Z', '') : price.fromDate) : defaultFromDate;
        toDatePrice = !!price.toDate ? new Date(price.toDate.endsWith('Z')
          ? price.toDate.replace('Z', '') : price.toDate) : defaultToDate;

        fromDatePromotion = !!promotion.fromDate ? new Date(promotion.fromDate.endsWith('Z')
          ? promotion.fromDate.replace('Z', '') : promotion.fromDate) : defaultFromDate;
        toDatePromotion = !!promotion.toDate ? new Date(promotion.toDate.endsWith('Z')
          ? promotion.toDate.replace('Z', '') : promotion.toDate) : defaultToDate;

        hasOnePriceInPromotionTime = fromDatePrice.getTime() <= fromDatePromotion.getTime()
          && toDatePrice.getTime() >= toDatePromotion.getTime();

        return !!price.currencyCode && price.currencyCode.toLowerCase() === 'MMK'.toLowerCase()
          && hasOnePriceInPromotionTime && price.priceType === PriceType._OUT
          && price.status === PriceStatusEnum._APPROVED;
      });
    }
  }
}
