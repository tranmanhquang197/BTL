import {Promotion} from "../../_models/promotion/promotion.model";
import {CommonUtils} from "../common/common.utils";
import {PromotionStatusEnum} from "../../_models/promotion/enums/promotion.status.enum";
import {DateUtilService} from "@next-solutions/next-solutions-base";
import {FormBuilder} from "@angular/forms";

export class CampaignUtils {

  static getCampaignStatusClass(dateUtilService: DateUtilService, campaign: Promotion | null | undefined | any) {
    if (this.isClosedCampaign(dateUtilService, campaign)) {
      return 'closed';
    }
    if (this.isDeactivatedCampaign(campaign)) {
      return 'rejected';
    }
    if (this.isOngoingCampaign(dateUtilService, campaign)) {
      return 'ongoing';
    }
    if (this.isPendingCampaign(campaign)) {
      return 'pending';
    }
  }

  static getCampaignStatusLabel(dateUtilService: DateUtilService, campaign: Promotion | null | undefined | any) {
    if (this.isClosedCampaign(dateUtilService, campaign)) {
      return 'common.status.closed';
    }
    if (this.isDeactivatedCampaign(campaign)) {
      return 'common.status.cancelled';
    }
    if (this.isOngoingCampaign(dateUtilService, campaign)) {
      return 'common.status.ongoing';
    }
    if (this.isPendingCampaign(campaign)) {
      return 'common.status.pending';
    }
    return '';
  }

  static isClosedCampaign(dateUtilService: DateUtilService, campaign: Promotion | null | undefined): boolean {
    return !!campaign && PromotionStatusEnum['_' + campaign.status] === PromotionStatusEnum._ACCEPTED
      && CommonUtils.isExpired(dateUtilService, campaign.toDate);
  }

  static isOngoingCampaign(dateUtilService: DateUtilService, campaign: Promotion | null | undefined): boolean {
    return !!campaign && PromotionStatusEnum['_' + campaign.status] === PromotionStatusEnum._ACCEPTED
      && CommonUtils.isBeingActivated(dateUtilService, campaign);
  }

  static isDeactivatedCampaign(campaign: Promotion | null | undefined): boolean {
    return !!campaign && PromotionStatusEnum['_' + campaign.status] === PromotionStatusEnum._REJECTED;
  }

  static isPendingCampaign(campaign: Promotion | null | undefined): boolean {
    return !!campaign && PromotionStatusEnum['_' + campaign.status] === PromotionStatusEnum._DRAFT;
  }

}
