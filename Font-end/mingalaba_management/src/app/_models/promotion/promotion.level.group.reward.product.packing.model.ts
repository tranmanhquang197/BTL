import {SuperEntity} from '@next-solutions/next-solutions-base';
import {PromotionLevelGroupReward} from './promotion.level.group.reward.model';
import {Promotion} from './promotion.model';
import {PromotionLevelGroupSell} from "./promotion.level.group.sell.model";

export class PromotionLevelGroupRewardProductPacking extends SuperEntity {
  promotionLevelGroupReward: PromotionLevelGroupReward | undefined | null;
  productPackingCode: string | undefined;
  productPackingName: string | undefined;
  quantity: number;
  price: any; // number | ''
  amount: number;
  mch5Code: string | undefined;
  mch5Name: string | undefined;
  imageUrl: string | undefined;
  sku: string | undefined;
  packingTypeCode: string | undefined;
  packingTypeQuantity: string | undefined;
  distributorCode: string | undefined;

  hasNotPrice?: boolean;
  stock = 0;
  stt = 0; // bonus to display

  constructor(groupReward?: {
    code?: string,
    price?: number,
    name?: string,
    quantity?: number,
    amount?: number,
    mch5Code?: string,
    mch5Name?: string,
    imageUrl?: string,
    sku?: string,
    packingTypeCode?: string,
    packingTypeQuantity?: string,
    distributorCode?: string,
    stock?: number
  }) {
    super();
    this.quantity = groupReward && groupReward.quantity ? groupReward.quantity : 0;
    this.amount = groupReward && groupReward.amount ? groupReward.amount : 0;
    this.productPackingCode = groupReward && groupReward.code ? groupReward.code : undefined;
    this.productPackingName = groupReward && groupReward.name ? groupReward.name : undefined;
    this.price = groupReward && groupReward.price ? groupReward.price : null;
    this.mch5Code = groupReward && groupReward.mch5Code ? groupReward.mch5Code : undefined;
    this.mch5Name = groupReward && groupReward.mch5Name ? groupReward.mch5Name : undefined;
    this.imageUrl = groupReward && groupReward.imageUrl ? groupReward.imageUrl : undefined;
    this.sku = groupReward && groupReward.sku ? groupReward.sku : undefined;
    this.packingTypeCode = groupReward && groupReward.packingTypeCode ? groupReward.packingTypeCode : undefined;
    this.packingTypeQuantity = groupReward && groupReward.packingTypeQuantity ? groupReward.packingTypeQuantity : undefined;
    this.distributorCode = groupReward && groupReward.distributorCode ? groupReward.distributorCode : undefined;
    this.stock = groupReward && groupReward.stock ? groupReward.stock : 0;
  }

  static reduceReferenceCircle(ppReward: PromotionLevelGroupRewardProductPacking) {
    ppReward.promotionLevelGroupReward = ppReward.promotionLevelGroupReward?.id ? new PromotionLevelGroupReward(ppReward.promotionLevelGroupReward?.id) : undefined;
  }
}
