import {SuperEntity} from '@next-solutions/next-solutions-base';
import {Promotion} from '../promotion.model';

export class PromotionDistributorModel extends SuperEntity {
  campaign: any;
  promotion: Promotion | undefined | null;
  distributorCode: string | undefined | null;
  distributorName: string | undefined | null;
}
