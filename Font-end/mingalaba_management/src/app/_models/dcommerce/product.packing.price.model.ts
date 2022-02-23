import {SuperEntity} from '@next-solutions/next-solutions-base';
import {PriceType} from '../enums/price.type.enum';
import {Country} from './country.model';
import {PriceStatusEnum} from '../enums/price.status.enum';

export class ProductPackingPrice extends SuperEntity {
  currencyCode: string | undefined | null;
  price: number | undefined | null;
  priceType: PriceType | undefined | null;
  fromDate: string | undefined | null;
  toDate: string | undefined | null;
  status: PriceStatusEnum | undefined | null;
}

