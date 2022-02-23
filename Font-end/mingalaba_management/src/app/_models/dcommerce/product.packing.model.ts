import {SuperEntity} from '@next-solutions/next-solutions-base';
import {ProductPackingDescription} from './product.packing.description';
import {ProductPackingPrice} from './product.packing.price.model';
import {Mch} from "./mch.model";

export class ProductPacking extends SuperEntity {
  code: string | undefined | null;
  name: string | undefined | null;
  lstProductDescription: ProductPackingDescription[] | undefined | null;
  productDescription: ProductPackingDescription | undefined | null;
  packingPrice: ProductPackingPrice[] | undefined | null;
  value?: string;
  displayValue?: string;
  packingUrl?: string;
  typeCode?: string;
  typeQuantity?: string;
  stock?: number;
  quantity?: number;
  maxSellQuantity?: number | null;
  distributorCode?: string;
  discount: number | undefined;
  selectPrice: number | undefined;
  mch5Name: string | undefined;
  mch5Code: string | undefined;
  salePrice: number | undefined;
  sku: string | undefined;
  amount?: number; // mapping product packing sell, reward
  stt = 0; // only display, not storage
}
