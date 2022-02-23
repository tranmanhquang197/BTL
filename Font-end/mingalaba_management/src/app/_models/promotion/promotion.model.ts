import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import { PromotionManufacturer } from './applyfor/promotion.manufacturer.model';
import { PromotionStore } from './applyfor/promotion.store.model';
import { PromotionTownship } from './applyfor/promotion.township.model';
import { PromotionLevel } from './promotion.level.model';
import { FormGroup } from '@angular/forms';
import { PromotionFlashSaleRangeTimeModel } from './promotionFlashSaleRangeTimeModel';
import { PromotionFlashSaleUtils } from '../../_utils/promotion/promotion.flash.sale.utils';
import { PromotionDisplayTypeEnum } from './enums/promotion.display.type.enum';
import { PromotionAccountCouponModel } from './promotionAccountCouponModel';
import {PromotionDistributorModel} from './applyfor/promotionDistributorModel';
import {PromotionImageModel} from './promotionImageModel';
import {PromotionSegment} from './applyfor/promotion.segment.model';
import {MStoreCampaignModel} from '../mstore-campaign/mstore-campaign.model';
import {couponTypeAction} from "./campaign.const";

export class Promotion extends SuperEntity {
  clientId: string | undefined;
  type: string | undefined;
  code: string | undefined;
  campaign?: MStoreCampaignModel;
  name: string | undefined;
  validTime: DateRangePickerModel | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  displayType: string | undefined;
  description: string | undefined;
  rejectReason: string | undefined;
  status: string | undefined;
  maximumNumberOfTurns: number | undefined;
  usesPerCustomer: number | undefined;
  attendance: string | undefined;
  promotionManufacturers: PromotionManufacturer[] = [];
  promotionDistributors: PromotionDistributorModel[] = [];
  promotionStores: PromotionStore[] = [];
  promotionTownships: PromotionTownship[] = [];
  promotionLevels: PromotionLevel[] = [];
  promotionCouponAccounts: PromotionAccountCouponModel[] = [];
  promotionFlashSaleRangeTimes: PromotionFlashSaleRangeTimeModel[] = [];
  // responsiblePayReward: string;
  promotionImages: PromotionImageModel[] = [];
  promotionSegments: PromotionSegment[] = [];

  manufacturers: (string | undefined | null)[] | undefined;
  distributors: (string | undefined | null)[] | undefined;
  stores: (string | undefined | null)[] | undefined;
  townships: (string | undefined)[] | undefined;
  accountUsernames: (string | undefined)[] | undefined;
  segments: (number | undefined)[] | undefined;
  images: any[] | undefined;

  totalPackingSell = 0; // to display not storage

  constructor(form: FormGroup | number | undefined | null) {
    super();
    if (form){
      if (form instanceof FormGroup) {
        const fId = form.get('id');
        if (fId) {
          this.id = fId.value;
        }
        const fClientId = form.get('clientId');
        if (fClientId) {
          this.clientId = fClientId.value;
        }
        const ftype = form.get('type');
        if (ftype) {
          this.type = ftype.value;
        }
        const fCode = form.get('code');
        if (fCode) {
          this.code = fCode.value;
        }
        const fName = form.get('name');
        if (fName) {
          this.name = fName.value;
        }
        const fFromDate = form.get('fromDate');
        if (fFromDate) {
          this.fromDate = fFromDate.value;
        }
        const fToDate = form.get('toDate');
        if (fToDate) {
          this.toDate = fToDate.value;
        }
        const fDisplayType = form.get('displayType');
        if (fDisplayType) {
          this.displayType = fDisplayType.value;
        }
        const fDescription = form.get('description');
        if (fDescription) {
          this.description = fDescription.value;
        }
        const fPromotionImages = form.get('promotionImages');
        if (fPromotionImages) {
          this.promotionImages = fPromotionImages.value ? fPromotionImages.value : [];
          if (this.id){
            this.promotionImages.forEach(ki => ki.promotion = new Promotion(this.id));
          }
        }
        const fStatus = form.get('status');
        if (fStatus) {
          this.status = fStatus.value;
        }
        const fMaximumNumberOfTurns = form.get('maximumNumberOfTurns');
        if (fMaximumNumberOfTurns) {
          this.maximumNumberOfTurns = fMaximumNumberOfTurns.value;
        }
        const fUsesPerCustomer = form.get('usesPerCustomer');
        if (fUsesPerCustomer) {
          this.usesPerCustomer = fUsesPerCustomer.value;
        }
        const fAttendance = form.get('attendance');
        if (fAttendance) {
          this.attendance = fAttendance.value;
        }

        const fPromotionLevels = form.get('promotionLevels');
        if (fPromotionLevels && fPromotionLevels.value) {
          this.promotionLevels = fPromotionLevels.value;
          this.promotionLevels?.forEach(ks => ks.promotion = this.id ? new Promotion(this.id) : undefined);
        }

        const fPromotionManufacturers = form.get('promotionManufacturers');
        if (fPromotionManufacturers && fPromotionManufacturers.value) {
          this.promotionManufacturers = fPromotionManufacturers.value;
          this.promotionManufacturers?.forEach(km => km.promotion = new Promotion(this.id));
        }
        const fPromotionDistributors = form.get('promotionDistributors');
        if (fPromotionDistributors && fPromotionDistributors.value) {
          this.promotionDistributors = fPromotionDistributors.value;
          this.promotionDistributors?.forEach(kd => kd.promotion = new Promotion(this.id));
        }
        const fPromotionStores = form.get('promotionStores');
        if (fPromotionStores && fPromotionStores.value) {
          this.promotionStores = fPromotionStores.value;
          this.promotionStores?.forEach(ks => ks.promotion = new Promotion(this.id));
        }
        const fPromotionSegments = form.get('promotionSegments');
        if (fPromotionSegments && fPromotionSegments.value) {
          this.promotionSegments = fPromotionSegments.value;
          this.promotionSegments?.forEach(ks => ks.promotion = new Promotion(this.id));
        }
        const fPromotionTownships = form.get('promotionTownships');
        if (fPromotionTownships && fPromotionTownships.value) {
          this.promotionTownships = fPromotionTownships.value;
          this.promotionTownships?.forEach((pt:PromotionTownship)  => {
            pt.promotion = new Promotion(this.id);
            pt.township = null;
          });
        }
        const fPromotionCouponAccounts = form.get('promotionCouponAccounts');
        if (fPromotionCouponAccounts && fPromotionCouponAccounts.value && fDisplayType &&
          (couponTypeAction.isBeforeATransactionMade(fDisplayType.value) || couponTypeAction.isAfterATransactionMade(fDisplayType.value))) {
          this.promotionCouponAccounts = fPromotionCouponAccounts.value;
          this.promotionCouponAccounts?.forEach(kca => kca.promotion = new Promotion(this.id));
        }else {
          this.promotionCouponAccounts = [];
        }
        const fPromotionFlashSaleRangeTimes = form.get('promotionFlashSaleRangeTimes');
        if (this.id && fPromotionFlashSaleRangeTimes && fDisplayType && fDisplayType.value === PromotionDisplayTypeEnum._FLASH_SALE) {
            this.promotionFlashSaleRangeTimes = fPromotionFlashSaleRangeTimes.value;
                // PromotionFlashSaleUtils.convertPromotionFlashSaleRangeTimesMatrixToList(this, fPromotionFlashSaleRangeTimes.value);
          this.promotionFlashSaleRangeTimes?.forEach(kfl => kfl.promotion = new Promotion(this.id));
        }

        // const fResponsiblePayReward = form.get('responsiblePayReward');
        // if (fResponsiblePayReward && fResponsiblePayReward.value) {
        //   this.responsiblePayReward = this.promotionDistributors.length === 1 ? this.promotionDistributors[0].distributorCode
        //     : CommonUtils.getDistributorCode();
        // }else{
        //   this.responsiblePayReward = null;
        // }

      } else {
        this.id = form;
      }
    }

  }

  public static clone(prom: Promotion): Promotion{
    const newProm = new Promotion(prom.id);

      newProm.id =prom.id;

      newProm.clientId = prom.clientId;

      newProm.type = prom.type;

      newProm.code = prom.code;

      newProm.name = prom.name;

      newProm.fromDate = prom.fromDate;

      newProm.toDate = prom.toDate;

      newProm.displayType = prom.displayType;

      newProm.description = prom.description;

      newProm.promotionImages = prom.promotionImages ? prom.promotionImages : [];
      if (newProm.id){
        newProm.promotionImages.forEach(ki => ki.promotion = new Promotion(newProm.id));
      }

      newProm.status = prom.status;

      newProm.maximumNumberOfTurns = prom.maximumNumberOfTurns;

      newProm.attendance = prom.attendance;

      newProm.promotionLevels = prom.promotionLevels;
      newProm.promotionLevels?.forEach(ks => ks.promotion = newProm.id ? new Promotion(newProm.id) : undefined);


      newProm.promotionManufacturers = prom.promotionManufacturers;
      newProm.promotionManufacturers?.forEach(km => km.promotion = new Promotion(newProm.id));

      newProm.promotionDistributors = prom.promotionDistributors;
      newProm.promotionDistributors?.forEach(kd => kd.promotion = new Promotion(newProm.id));

      newProm.promotionStores = prom.promotionStores;
      newProm.promotionStores?.forEach(ks => ks.promotion = new Promotion(newProm.id));

      newProm.promotionSegments = prom.promotionSegments;
      newProm.promotionSegments?.forEach(ks => ks.promotion = new Promotion(newProm.id));

      newProm.promotionTownships = prom.promotionTownships;
      newProm.promotionTownships?.forEach((pt:PromotionTownship)  => {
        pt.promotion = new Promotion(newProm.id);
        pt.township = null;
      });

      newProm.promotionCouponAccounts = prom.promotionCouponAccounts;
      newProm.promotionCouponAccounts?.forEach(kca => kca.promotion = new Promotion(newProm.id));

      newProm.promotionFlashSaleRangeTimes = prom.promotionFlashSaleRangeTimes;
      // PromotionFlashSaleUtils.convertPromotionFlashSaleRangeTimesMatrixToList(this, fPromotionFlashSaleRangeTimes.value];
      newProm.promotionFlashSaleRangeTimes?.forEach(kfl => kfl.promotion = new Promotion(newProm.id));
      newProm.campaign = prom.campaign;

    // const fResponsiblePayReward = prom['responsiblePayReward'];
    // if (fResponsiblePayReward && fResponsiblePayReward.value) {
    //   newProm.responsiblePayReward = newProm.promotionDistributors.length === 1 ? newProm.promotionDistributors[0].distributorCode
    //     : window.sessionStorage.getItem('distributorCode'];
    // }else{
    //   newProm.responsiblePayReward = null;
    // }
    return newProm;
  }


}
