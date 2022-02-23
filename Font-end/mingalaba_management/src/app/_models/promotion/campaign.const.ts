import {Promotion} from './promotion.model';
import {MStoreCampaignModel} from '../mstore-campaign/mstore-campaign.model';

export enum RewardTypeCampaign {
  AMOUNT = 'AMOUNT',
  PERCENT = 'PERCENT',
  FREE_ITEM = 'FREE_ITEM'
}

export const couponType = {
  COUPON: {
    label: 'campaign.label.coupon.before.transaction'
  },
  COUPON_AFTER_TRANSACTION: {
    label: 'campaign.label.coupon.after.transaction'
  }
};

export const couponTypeAction = {
  isBeforeATransactionMade(campaign: Promotion | undefined | string) {
    if (typeof campaign === 'string'){
      return !!campaign && couponType[campaign] === couponType.COUPON
    }
    return !!campaign && !!campaign.displayType && couponType[campaign.displayType + ''] === couponType.COUPON;
  },
  isAfterATransactionMade(campaign: Promotion | undefined | string) {
    if (typeof campaign === 'string'){
      return !!campaign && couponType[campaign] === couponType.COUPON_AFTER_TRANSACTION
    }
    return !!campaign && !!campaign.displayType && couponType[campaign.displayType + ''] === couponType.COUPON_AFTER_TRANSACTION;
  },
};

export const campaignType = {
  _: {label: 'campaign.type.all'},
  PROMOTION_BUNDLE_QUANTITY_AMOUNT: {
    label: 'campaign.type.PROMOTION_BUNDLE_QUANTITY_AMOUNT',
    rewardType: RewardTypeCampaign.AMOUNT
  },
  PROMOTION_BUNDLE_QUANTITY_PERCENT: {
    label: 'campaign.type.PROMOTION_BUNDLE_QUANTITY_PERCENT',
    rewardType: RewardTypeCampaign.PERCENT
  },
  PROMOTION_BUNDLE_QUANTITY_FREEITEM: {
    label: 'campaign.type.PROMOTION_BUNDLE_QUANTITY_FREEITEM',
    rewardType: RewardTypeCampaign.FREE_ITEM
  },

  PROMOTION_LINE_QUANTITY_AMOUNT: {
    label: 'campaign.type.PROMOTION_LINE_QUANTITY_AMOUNT',
    rewardType: RewardTypeCampaign.AMOUNT
  },
  PROMOTION_LINE_QUANTITY_PERCENT: {
    label: 'campaign.type.PROMOTION_LINE_QUANTITY_PERCENT',
    rewardType: RewardTypeCampaign.PERCENT
  },
  PROMOTION_LINE_QUANTITY_FREEITEM: {
    label: 'campaign.type.PROMOTION_LINE_QUANTITY_FREEITEM',
    rewardType: RewardTypeCampaign.FREE_ITEM
  },
  PROMOTION_GROUP_AMOUNT_AMOUNT: {
    label: 'campaign.type.PROMOTION_GROUP_AMOUNT_AMOUNT',
    rewardType: RewardTypeCampaign.AMOUNT
  },
  PROMOTION_GROUP_AMOUNT_PERCENT: {
    label: 'campaign.type.PROMOTION_GROUP_AMOUNT_PERCENT',
    rewardType: RewardTypeCampaign.PERCENT
  },
  PROMOTION_GROUP_AMOUNT_FREEITEM: {
    label: 'campaign.type.PROMOTION_GROUP_AMOUNT_FREEITEM',
    rewardType: RewardTypeCampaign.FREE_ITEM
  },
  PROMOTION_ORDER_AMOUNT_PERCENT: {
    label: 'campaign.type.PROMOTION_ORDER_AMOUNT_PERCENT',
    rewardType: RewardTypeCampaign.PERCENT
  },
  PROMOTION_ORDER_AMOUNT_AMOUNT: {
    label: 'campaign.type.PROMOTION_ORDER_AMOUNT_AMOUNT',
    rewardType: RewardTypeCampaign.AMOUNT
  },
  // PROMOTION_LINE_QUANTITY_PARITY: {
  //   label: 'campaign.type.PROMOTION_LINE_QUANTITY_PARITY',
  //   rewardType: RewardTypeCampaign.AMOUNT
  // },
};
export const campaignTypeAction = {
  isAmountRewardCampaign: (campaign: Promotion | undefined) => {
    return !!campaign && campaignType[campaign.type + '']?.rewardType === RewardTypeCampaign.AMOUNT;
  },

  isPercentRewardCampaign: (campaign: Promotion | undefined) => {
    return !!campaign && campaignType[campaign.type + '']?.rewardType === RewardTypeCampaign.PERCENT;
  },

  isFreeItemRewardCampaign: (campaign: Promotion | undefined) => {
    return !!campaign && campaignType[campaign.type + '']?.rewardType === RewardTypeCampaign.FREE_ITEM;
  },

  isBundleQuantityCampaignType: (campaign: Promotion | undefined) => {
    return !!campaign && !!campaign.type && campaign.type.toUpperCase().includes('BUNDLE_QUANTITY');
  },
  isLineQuantityCampaignType: (campaign: Promotion | undefined) => {
    return !!campaign && !!campaign.type && campaign.type.toUpperCase().includes('LINE_QUANTITY');
  },
  isGroupAmountCampaignType: (campaign: Promotion | undefined) => {
    return !!campaign && !!campaign.type && campaign.type.toUpperCase().includes('GROUP_AMOUNT');
  },
  isParityCampaignType: (campaign: Promotion | undefined) => {
    return !!campaign && !!campaign.type && campaign.type.toUpperCase().includes('PROMOTION_LINE_QUANTITY_PARITY');
  },
  isCouponCampaignType: (campaign: Promotion | undefined | string) => {
    if (typeof campaign === 'string') {
      return !!campaign && campaign.toUpperCase().includes('ORDER_AMOUNT')
    }
    return !!campaign && !!campaign.type && campaign.type.toUpperCase().includes('ORDER_AMOUNT');
  }
};
export const campaignStatus = {
  _: {label: 'campaign.status._', btnClass: 'mat-cell viewData all'},

  ACCEPTED: {
    code: 'ACCEPTED',
    label: 'campaign.status.accepted',
    btnClass: 'mat-cell viewData approved mat-state-button',
    style: 'viewData approved mat-state-button'
  },
  DRAFT: {
    code: 'DRAFT',
    label: 'campaign.status.draft',
    btnClass: 'mat-cell viewData pending mat-state-button',
    style: 'viewData mat-state-button pending'
  },
  REJECTED: {
    code: 'REJECTED',
    label: 'campaign.status.rejected',
    btnClass: 'mat-cell viewData rejected mat-state-button',
    style: 'viewData rejected mat-state-button'
  },
  ON_GOING: {
    code: 'ON_GOING',
    label: 'campaign.status.ongoing',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button'
  },
  CLOSED: {
    code: 'CLOSED',
    label: 'campaign.status.closed',
    btnClass: 'mat-cell viewData closed mat-state-button',
    style: 'viewData closed mat-state-button'
  },

};
export const campaignStatusAction = {
  isAcceptedStatus: (campaign: Promotion | undefined | MStoreCampaignModel) => {
    return !!campaign && campaignStatus[campaign.status + '']?.label === campaignStatus.ACCEPTED.label;
  },
  isDraftStatus: (campaign: Promotion | undefined | MStoreCampaignModel) => {
    return !!campaign && campaignStatus[campaign.status + '']?.label === campaignStatus.DRAFT.label;
  },
  isRejectedStatus: (campaign: Promotion | undefined | MStoreCampaignModel) => {
    return !!campaign && campaignStatus[campaign.status + '']?.label === campaignStatus.REJECTED.label;
  },
  isOnGoingStatus: (campaign: Promotion | undefined | MStoreCampaignModel) => {
    return !!campaign && campaignStatus[campaign.status + '']?.label === campaignStatus.ON_GOING.label;
  },
  isClosedStatus: (campaign: Promotion | undefined | MStoreCampaignModel) => {
    return !!campaign && campaignStatus[campaign.status + '']?.label === campaignStatus.CLOSED.label;
  }
};

export const mstoreCampaignType = {
  _: {label: 'campaign.type.all'},
  FLASH_SALE: {
    label: 'mstore-campaign.type.flash.title'
  },
  PROMOTION_LINE_QUANTITY_PARITY: {
    label: 'mstore-campaign.type.parity.title'
  }
};

export const mstoreCampaignTypeAction = {
  isFlashSaleType(campaign: MStoreCampaignModel | undefined | string) {
    if (typeof campaign === 'string') {
      return !!campaign && campaign.toUpperCase() === 'FLASH_SALE';
    }
    return !!campaign && !!campaign.type && campaign.type.toUpperCase() === 'FLASH_SALE';
  },
  isParityType(campaign: MStoreCampaignModel | undefined) {
    return !!campaign && !!campaign.type && campaign.type.toUpperCase() === 'PROMOTION_LINE_QUANTITY_PARITY';
  }
};

export const mstoreCampaignRewardType = {
  PERCENT: {
    label: 'mstore-campaign.label.reward.type.percent'
  },
  AMOUNT: {
    label: 'mstore-campaign.label.reward.type.amount'
  }
};

export const mstoreCampaignRewardTypeAction = {
  isAmountRewardType(rewardType: string | undefined) {
    return !!rewardType && rewardType.toUpperCase() === 'AMOUNT';
  },

  isPercentRewardType(rewardType: string | undefined) {
    return !!rewardType && (rewardType.toUpperCase() === 'PERCENT');
  }
};


