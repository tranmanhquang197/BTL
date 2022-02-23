import {FlatTreeNode, SuperEntity} from '@next-solutions/next-solutions-base';
import {ProductPacking} from './product.packing.model';
import {Country} from './country.model';

export class Mch extends FlatTreeNode {
  id?: number | null;
  invalid?: boolean = false;
  code: string | undefined | null;
  name: string | undefined;
  children: Mch[] | undefined;
  lstPacking: ProductPacking[] | undefined | null;
  visible: boolean | undefined | null;
}
