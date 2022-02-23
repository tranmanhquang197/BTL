import {Promotion} from "../../promotion/promotion.model";

export enum CampaignAttendanceEnum {
  RETAILER = 'campaign.label.retailer',
  END_USER = 'campaign.label.end.user'
}

export const campaignAttendanceAction = {
  isRetailer(campaign: Promotion | string | undefined): boolean {
    if (typeof campaign === 'string') {
      return !!campaign && CampaignAttendanceEnum[campaign.toUpperCase()] === CampaignAttendanceEnum.RETAILER;
    } else {
      return !!campaign && CampaignAttendanceEnum[campaign.attendance?.toUpperCase() + ''] === CampaignAttendanceEnum.RETAILER;
    }
  },
  isEndUser(campaign: Promotion | string | undefined) {
    if (typeof campaign === 'string') {
      return !!campaign && CampaignAttendanceEnum[campaign.toUpperCase()] === CampaignAttendanceEnum.END_USER;
    } else {
      return !!campaign && CampaignAttendanceEnum[campaign.attendance?.toUpperCase() + ''] === CampaignAttendanceEnum.END_USER;
    }
  }
}
