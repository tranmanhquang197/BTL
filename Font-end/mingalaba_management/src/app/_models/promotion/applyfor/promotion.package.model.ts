import { SuperEntity } from '@next-solutions/next-solutions-base';
import { Promotion } from '../promotion.model';
import { Package } from '../../package.model';

export class PromotionPackage extends SuperEntity {
  promotion: Promotion | undefined | null;
  packageE: Package;

  constructor(packageE: Package) {
    super();
    this.packageE = packageE;
  }
}
