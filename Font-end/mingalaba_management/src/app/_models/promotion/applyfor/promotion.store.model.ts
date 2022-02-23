import {SuperEntity} from '@next-solutions/next-solutions-base';
import {Promotion} from '../promotion.model';

export class PromotionStore extends SuperEntity {
  promotion: Promotion | undefined | null;
  storeCode: string | undefined | null;
  storeName: string | undefined | null;
}
