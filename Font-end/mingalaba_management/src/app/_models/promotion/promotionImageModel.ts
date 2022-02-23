import {Promotion} from './promotion.model';

export class PromotionImageModel {
  createDate: string | undefined | null;
  createUser: string | undefined | null;
  description: string | undefined | null;
  id: number | undefined | null;
  promotion: Promotion | undefined | null;
  updateDate: string | undefined | null;
  updateUser: string | undefined | null;
  url: string | undefined | null;
}
