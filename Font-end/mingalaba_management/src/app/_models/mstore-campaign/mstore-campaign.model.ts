import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import {FormControl, FormGroup} from '@angular/forms';
import {CampaignCategoryModel} from '../campaign.category.model';
import {PromotionDistributorModel} from '../promotion/applyfor/promotionDistributorModel';
import {PromotionTownship} from '../promotion/applyfor/promotion.township.model';
import {Promotion} from "../promotion/promotion.model";


export class MStoreCampaignModel extends SuperEntity {


  campaignCategories: CampaignCategoryModel[] = [];
  campaignDistributors: PromotionDistributorModel[] = [];
  campaignFiles: { id?: number, url?: string, description?: string }[] = [];
  campaignImages: { id?: number, url?: string, description?: string }[] = [];
  promotionImages:any;
  campaignTownships: PromotionTownship[] = [];

  clientId?: string;
  code?: string;
  createDate?: string;
  createUser?: string;
  deliveryTimeRequired?: number;
  description?: string;
  fromDate?: string | null;

  fromDateRegistration?: string;

  id?: number
  minimumPercentageOff?: number;
  minimumQuantityOfEachPackageIdToBeSold?: number;
  name?: string;
  packageIdMinimumStock?: number;
  parityLevel?: number;
  promotions: Promotion[] = [];
  rejectReason?: string;
  status?: string;
  toDate?: string | null;
  toDateRegistration?: string;
  type?: string;

  validTime: DateRangePickerModel | any;
  registrationTime: DateRangePickerModel | any;
  banner: any;
  termService: any;
  locationTree: (string | undefined | null)[] = [];
  treePack: (string | undefined | null)[] = [];
  treeDistributor: (string | undefined | null)[] = [];

  constructor(form?: FormGroup | number) {
    super();
    if (!form) {
      return;
    }
    if (typeof form === 'number') {
      this.id = form;
    } else if (form instanceof FormGroup) {
      this.id = form.get('id')?.value;
      const fClientId = form.get('clientId');
      if (fClientId) {
        this.clientId = fClientId.value;
      }
      const fCode = form.get('code');
      if (fCode) {
        this.code = fCode.value;
      }

      this.deliveryTimeRequired = form.get('deliveryTimeRequired')?.value;
      this.description = form.get('description')?.value;

      this.fromDate = form.get('fromDate')?.value;
      this.fromDateRegistration = form.get('fromDateRegistration')?.value;
      this.minimumPercentageOff = form.get('minimumPercentageOff')?.value;
      this.minimumQuantityOfEachPackageIdToBeSold = form.get('minimumQuantityOfEachPackageIdToBeSold')?.value;
      this.name = form.get('name')?.value;
      this.packageIdMinimumStock = form.get('packageIdMinimumStock')?.value;
      this.parityLevel = form.get('parityLevel')?.value;
      this.toDate = form.get('toDate')?.value;
      this.type = form.get('type')?.value;
      this.toDateRegistration = form.get('toDateRegistration')?.value;
      this.campaignTownships = form.get('campaignTownships')?.value;
      this.campaignImages = [];
      this.campaignFiles = [];
      if (this.campaignTownships && this.campaignTownships.length > 0) {
        this.campaignTownships.forEach(town => {
          town.campaign = this.id ? new MStoreCampaignModel(this.id) : null;
        })
      }
      this.campaignCategories = form.get('campaignCategories')?.value;
      if (this.campaignCategories) {
        this.campaignCategories.forEach(cat => cat.campaign = this.id ? new MStoreCampaignModel(this.id) : null)
      }
      this.campaignDistributors = form.get('campaignDistributors')?.value;
      if (this.campaignDistributors) {
        this.campaignDistributors.forEach(d => {
          d.campaign = this.id ? new MStoreCampaignModel(this.id) : null;
        })
      }
    }
  }
}
