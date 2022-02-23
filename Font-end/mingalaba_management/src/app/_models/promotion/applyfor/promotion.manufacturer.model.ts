import { SuperEntity } from '@next-solutions/next-solutions-base';
import { Promotion } from '../promotion.model';

export class PromotionManufacturer extends SuperEntity {
  promotion: Promotion | undefined | null;
  manufacturerCode: string | undefined | null;
  manufacturerName: string | undefined | null;
}
