import {SuperEntity} from '@next-solutions/next-solutions-base';
import {Promotion} from '../promotion.model';
import {CountryLocation} from '../../dcommerce/country.location.model';

export class PromotionTownship extends SuperEntity {
  campaign: any;
  promotion: Promotion | undefined | null;
  townshipCode: string | undefined;
  townshipName: string | undefined;
  township: CountryLocation | null | undefined;
}
