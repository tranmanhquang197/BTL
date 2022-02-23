import {SuperEntity} from '@next-solutions/next-solutions-base';
import {PromotionLevelGroupSell} from './promotion.level.group.sell.model';

export class PromotionLevelGroupSellProductPacking extends SuperEntity {
  promotionId: number | undefined | null;
  promotionLevelGroupSell: PromotionLevelGroupSell | undefined | null;
  productPackingCode: string | null;
  productPackingName: string | null;
  quantity: number | null | undefined;
  amount: number | null;
  sellPrice: number | null;
  maxSellQuantity: number | null | undefined;
  mch5Code: string | null;
  mch5Name: string | null;
  imageUrl: string | null | undefined;
  sku: string | null | undefined;
  packingTypeCode: string | null | undefined;
  packingTypeQuantity: string | null | undefined;
  distributorCode: string | undefined;
  stock = 0;

  constructor(groupSell?: {
    quantity: number | null | undefined,
    amount?: number | null,
    code?: string,
    sellPrice?: number,
    name?: string,
    maxSellQuantity?: number | null,
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
    this.quantity = groupSell ? groupSell.quantity : 0;
    this.amount = groupSell && groupSell.amount ? groupSell.amount : null;
    this.productPackingCode = groupSell && groupSell.code ? groupSell.code : null;
    this.productPackingName = groupSell && groupSell.name ? groupSell.name : null;
    this.sellPrice = groupSell && groupSell.sellPrice ? groupSell.sellPrice : null;
    this.maxSellQuantity = groupSell && groupSell.maxSellQuantity ? groupSell.maxSellQuantity : 0;
    this.mch5Code = groupSell && groupSell.mch5Code ? groupSell.mch5Code : null;
    this.mch5Name = groupSell && groupSell.mch5Name ? groupSell.mch5Name : null;
    this.imageUrl = groupSell && groupSell.imageUrl ? groupSell.imageUrl : null;
    this.sku = groupSell && groupSell.sku ? groupSell.sku : null;
    this.packingTypeCode = groupSell && groupSell.packingTypeCode ? groupSell.packingTypeCode : null;
    this.packingTypeQuantity = groupSell && groupSell.packingTypeQuantity ? groupSell.packingTypeQuantity : null;
    this.distributorCode = groupSell && groupSell.distributorCode ? groupSell.distributorCode : undefined;
    this.stock = groupSell && groupSell.stock ? groupSell.stock : 0;
  }

  static reduceReferenceCircle(ppSell: PromotionLevelGroupSellProductPacking) {
    ppSell.promotionLevelGroupSell = ppSell.promotionLevelGroupSell?.id ? new PromotionLevelGroupSell(ppSell.promotionLevelGroupSell?.id) : undefined
  }
}
