import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import {FormGroup} from '@angular/forms';


export class CampaignCategoryModel extends SuperEntity {
  campaign: any;
  categoryCode?: string;
  categoryName?: string;
  id?: number;
}
