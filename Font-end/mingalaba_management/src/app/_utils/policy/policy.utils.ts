import {Policy} from '../../_models/policy/policy.model';
import {PolicyPackage} from '../../_models/policy/applyfor/policy.package.model';
import {PolicyDistributor} from '../../_models/policy/applyfor/policy.distributor.model';
import {PolicyManufacturer} from '../../_models/policy/applyfor/policy.manufacturer.model';
import {PolicyProductPacking} from '../../_models/policy/applyfor/policy.product.packing.model';
import {PolicyTownship} from '../../_models/policy/applyfor/policy.township.model';
import {PolicyStore} from '../../_models/policy/applyfor/policy.store.model';
import {Kpi} from '../../_models/kpi/kpi.model';
import {SelectModel} from '@next-solutions/next-solutions-base';
import {PolicyTypeEnum} from '../../_models/policy/enum/policy.type.enum';
import {KpiPackage} from '../../_models/kpi/applyfor/kpi.package.model';
import {KpiDistributor} from '../../_models/kpi/applyfor/kpi.distributor.model';
import {KpiManufacturer} from '../../_models/kpi/applyfor/kpi.manufacturer.model';
import {KpiLevel} from '../../_models/kpi/applyfor/kpi.level.model';
import {PolicyLevel} from '../../_models/policy/applyfor/policy.level.model';
import {KpiSegment} from '../../_models/kpi/applyfor/kpi.segment.model';
import {PolicySegment} from '../../_models/policy/applyfor/policy.segment.model';
import {PolicyMenuTypeEnum} from "../../_models/policy/enum/policy.menu.type.enum";

export class PolicyUtils {

  private static notApplyForPackagePolicyType: PolicyTypeEnum[] = [];

  private static requiredApplyForPolicyType: PolicyTypeEnum[] = [
    PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P1,
    PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P2,
    PolicyTypeEnum._REACHED_AMOUNT_DISCOUNT_PERCENT_ORDER_P1,
    PolicyTypeEnum._REACHED_AMOUNT_DISCOUNT_PERCENT_ORDER_P2
  ];

  private static integerRewardValueType: PolicyTypeEnum[] = [
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_ORDER,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_LOGIN,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_REVIEW_PRODUCT,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_OPERATE_FOR_DAYS,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_PURCHASE_IN_DAYS,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION
  ];

  private static integerMinValuePolicyDetail: PolicyTypeEnum[] = [
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_LOGIN,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_REVIEW_PRODUCT,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_OPERATE_FOR_DAYS,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT,
  ];

  private static rewardPointPolicyType: PolicyTypeEnum[] = [
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_ORDER,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_LOGIN,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_REVIEW_PRODUCT,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_OPERATE_FOR_DAYS,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_PURCHASE_IN_DAYS,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION,
    PolicyTypeEnum._LOYALTY_POINT_INSTALL_APP_EXISTS_PURCHASE
  ];
  private static rewardPercentPolicyType: PolicyTypeEnum[] = [
    PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P1,
    PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P2,
    PolicyTypeEnum._INCENTIVE_RATE_PERCENT_REVENUE,
    PolicyTypeEnum._REACHED_AMOUNT_DISCOUNT_PERCENT_ORDER_P1,
    PolicyTypeEnum._REACHED_AMOUNT_DISCOUNT_PERCENT_ORDER_P2
  ];
  private static rewardAmountPolicyType: PolicyTypeEnum[] = [
    // PolicyTypeEnum._DISCOUNT_AMOUNT_ORDER,
    PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_REVENUE,
    PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT,
    PolicyTypeEnum._INCENTIVE_RATE_INSTALL_APP_EXISTS_PURCHASE
    // PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION
  ];

  private static onlyOneLevelPolicyType: PolicyTypeEnum[] = [
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_ORDER,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION,
    // PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    // PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT,
    // PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION,
    PolicyTypeEnum._INCENTIVE_RATE_INSTALL_APP_EXISTS_PURCHASE,
    PolicyTypeEnum._LOYALTY_POINT_INSTALL_APP_EXISTS_PURCHASE,
    // PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P1,
    // PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P2,
  ];

  // set minValue default is 1
  private static minValueDefaultPolicyType: PolicyTypeEnum[] = [
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION,
    // PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    // PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION,
    PolicyTypeEnum._INCENTIVE_RATE_INSTALL_APP_EXISTS_PURCHASE,
    PolicyTypeEnum._LOYALTY_POINT_INSTALL_APP_EXISTS_PURCHASE,
    // PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P1,
    // PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P2,
  ];

  private static hideMinValueDetailPolicyType: PolicyTypeEnum[] = [
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    // PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION,
    // PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    // PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION,
    PolicyTypeEnum._INCENTIVE_RATE_INSTALL_APP_EXISTS_PURCHASE,
    PolicyTypeEnum._LOYALTY_POINT_INSTALL_APP_EXISTS_PURCHASE,
    // PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P1,
    // PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P2,
  ];

  private static pricePolicyType: PolicyTypeEnum[] = [
    PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P1,
    PolicyTypeEnum._DISCOUNT_PERCENT_ORDER_P2,
    PolicyTypeEnum._REACHED_AMOUNT_DISCOUNT_PERCENT_ORDER_P1,
    PolicyTypeEnum._REACHED_AMOUNT_DISCOUNT_PERCENT_ORDER_P2
  ];

  private static channelPolicyType: PolicyTypeEnum[] = [
    PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_REVENUE,
    PolicyTypeEnum._INCENTIVE_RATE_PERCENT_REVENUE,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_LOGIN,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_ORDER,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_REVIEW_PRODUCT,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT,
    PolicyTypeEnum._LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_PURCHASE_IN_DAYS,
    PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION,
    PolicyTypeEnum._INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT,
    PolicyTypeEnum._INCENTIVE_RATE_INSTALL_APP_EXISTS_PURCHASE,
    PolicyTypeEnum._LOYALTY_POINT_INSTALL_APP_EXISTS_PURCHASE
  ];

  static isDisplayMinValueDetailColumn(policy: Policy | string | undefined) {
    if (typeof (policy) === 'string') {
      return !!policy && !this.hideMinValueDetailPolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && !this.hideMinValueDetailPolicyType.includes(PolicyTypeEnum['_' + policy.type])
  }

  static isRequiredApplyForPolicyType(policy: Policy | string | undefined) {
    if (typeof (policy) === 'string') {
      return !!policy && this.requiredApplyForPolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.requiredApplyForPolicyType.includes(PolicyTypeEnum['_' + policy.type])
  }

  static isPricePolicyType(policy: Policy | string | undefined) {
    if (typeof (policy) === 'string') {
      return !!policy && this.pricePolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.pricePolicyType.includes(PolicyTypeEnum['_' + policy.type])
  }

  static isChannelPolicyType(policy: Policy | string | undefined) {
    if (typeof (policy) === 'string') {
      return !!policy && this.channelPolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.channelPolicyType.includes(PolicyTypeEnum['_' + policy.type])
  }

  static isPricePolicyMenuType(policy: Policy | string | undefined) {
    if (typeof (policy) === 'string') {
      return !!policy && PolicyMenuTypeEnum['_' + policy] === PolicyMenuTypeEnum._PRICE_POLICY;
    }
    return !!policy && PolicyMenuTypeEnum['_' + policy.type] === PolicyMenuTypeEnum._PRICE_POLICY;
  }

  static isChannelPolicyMenuType(policy: Policy | string | undefined) {
    if (typeof (policy) === 'string') {
      return !!policy && PolicyMenuTypeEnum['_' + policy] === PolicyMenuTypeEnum._CHANNEL_POLICY;
    }
    return !!policy && PolicyMenuTypeEnum['_' + policy.type] === PolicyMenuTypeEnum._CHANNEL_POLICY;
  }

  static isMinValueDefaultPolicyType(policy: Policy | string | undefined) {
    if (typeof (policy) === 'string') {
      return !!policy && this.minValueDefaultPolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.minValueDefaultPolicyType.includes(PolicyTypeEnum['_' + policy.type])
  }

  static applyForPackage(policy: Policy | string) {
    if (typeof (policy) === 'string') {
      return !!policy && !this.notApplyForPackagePolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && !this.notApplyForPackagePolicyType.includes(PolicyTypeEnum['_' + policy.type])
  }

  static isAmountReward(policy: Policy | undefined | string) {
    if (typeof policy === 'string') {
      policy = policy.startsWith('_') ? policy.replace('_', '') : policy;
      return !!policy && this.rewardAmountPolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.rewardAmountPolicyType.includes(PolicyTypeEnum['_' + policy.type]);
  }

  static isPercentReward(policy: Policy | undefined | string) {
    if (typeof policy === 'string') {
      policy = policy.startsWith('_') ? policy.replace('_', '') : policy;
      return !!policy && this.rewardPercentPolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.rewardPercentPolicyType.includes(PolicyTypeEnum['_' + policy.type]);
  }

  static isPointReward(policy: Policy | undefined | string) {
    if (typeof policy === 'string') {
      policy = policy.startsWith('_') ? policy.replace('_', '') : policy;
      return !!policy && this.rewardPointPolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.rewardPointPolicyType.includes(PolicyTypeEnum['_' + policy.type]);
  }

  static isOnlyOneLevelRewardLevel(policy: Policy | undefined | string) {
    if (typeof policy === 'string') {
      policy = policy.startsWith('_') ? policy.replace('_', '') : policy;
      return !!policy && this.onlyOneLevelPolicyType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.onlyOneLevelPolicyType.includes(PolicyTypeEnum['_' + policy.type]);
  }

  static isOtherType(policy: Policy | undefined) {
    return !!policy && policy.type?.toLowerCase() === 'other';
  }

  static isIntegerRewardValue(policy: Policy | undefined | string) {
    if (typeof policy === 'string') {
      policy = policy.startsWith('_') ? policy.replace('_', '') : policy;
      return !!policy && this.integerRewardValueType.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.integerRewardValueType.includes(PolicyTypeEnum['_' + policy.type]);
  }

  static isIntegerMinValuePolicyDetail(policy: Policy | undefined | string) {
    if (typeof policy === 'string') {
      policy = policy.startsWith('_') ? policy.replace('_', '') : policy;
      return !!policy && this.integerMinValuePolicyDetail.includes(PolicyTypeEnum['_' + policy]);
    }
    return !!policy && this.integerMinValuePolicyDetail.includes(PolicyTypeEnum['_' + policy.type]);
  }

  static setPolicyApplyFor(editedPolicy: Policy, policy: Policy, kpi: Kpi,
                           bonusSetParam: { productPackingOptions?: SelectModel[] }): Policy {
    if ((!editedPolicy.policyPackages || editedPolicy.policyPackages.length === 0) && kpi.kpiPackages.length > 0) {
      editedPolicy.policyPackages = kpi.kpiPackages.map((kp: KpiPackage) => new PolicyPackage(
        {
          packageE: kp.packageE,
          policy
        }));
    }

    if ((!editedPolicy.policyLevels || editedPolicy.policyLevels.length === 0) && kpi.kpiLevels.length > 0) {
      editedPolicy.policyLevels = kpi.kpiLevels.map((kp: KpiLevel) => new PolicyLevel(
        {
          level: kp.level,
          policy
        }));
    }

    if ((!editedPolicy.policySegments || editedPolicy.policySegments.length === 0) && kpi.kpiSegments.length > 0) {
      editedPolicy.policySegments = kpi.kpiSegments.map((kp: KpiSegment) => new PolicySegment(
        {
          segment: kp.segment,
          policy
        }));
    }

    if ((!editedPolicy.policyDistributors || editedPolicy.policyDistributors.length === 0) && kpi.kpiDistributors.length > 0) {
      editedPolicy.policyDistributors = kpi.kpiDistributors.map((kd: KpiDistributor) => new PolicyDistributor(
        {
          distributorCode: kd.distributorCode,
          distributorName: kd.distributorName,
          policy
        }));
    }

    if ((!editedPolicy.policyManufacturers || editedPolicy.policyManufacturers.length === 0) && kpi.kpiManufacturers.length > 0) {
      editedPolicy.policyManufacturers = kpi.kpiManufacturers
        .map((km: KpiManufacturer) => new PolicyManufacturer(
          {
            manufacturerCode: km.manufacturerCode,
            manufacturerName: km.manufacturerName,
            policy
          }));
    }
    if ((!editedPolicy.policyProductPackings || editedPolicy.policyProductPackings.length === 0) && kpi.kpiProductPackings.length > 0) {
      editedPolicy.policyProductPackings = bonusSetParam.productPackingOptions
        ? bonusSetParam.productPackingOptions.map(pp => new PolicyProductPacking(
          {
            productPackingCode: pp.rawData.code,
            productPackingName: pp.rawData.productDescription.productName,
            policy
          }))
        : kpi.kpiProductPackings
          .map(kpp => new PolicyProductPacking(
            {
              productPackingCode: kpp.productPackingCode,
              productPackingName: kpp.productPackingName,
              policy
            }));
    }
    if ((!editedPolicy.policyTownships || editedPolicy.policyTownships.length === 0) && kpi.kpiTownships.length > 0) {
      editedPolicy.policyTownships = kpi.kpiTownships
        .map(kt => new PolicyTownship(
          {
            townshipCode: kt.townshipCode,
            townshipName: kt.townshipName,
            policy
          }));
    }
    if ((!editedPolicy.policyStores || editedPolicy.policyStores.length === 0) && kpi.kpiStores.length > 0) {
      editedPolicy.policyStores = kpi.kpiStores
        .map(kt => new PolicyStore(
          {
            storeCode: kt.storeCode,
            storeName: kt.storeName,
            policy
          }));
    }

    return editedPolicy;
  }
}
