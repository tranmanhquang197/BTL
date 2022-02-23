import {PromotionRoleEnum} from '../../_models/promotion/enums/promotion.role.enum';
import {AuthoritiesService} from '@next-solutions/next-solutions-base';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PromotionAuthoritiesUtils {
  constructor(private authoritiesService: AuthoritiesService) {
  }

  static isGroupType(type: string): boolean {
    return type?.toLowerCase().indexOf('GROUP'.toLowerCase()) >= 0;
  }

  static isBundleType(type: string): boolean {
    return type?.toLowerCase().indexOf('BUNDLE'.toLowerCase()) >= 0;
  }

  isPromotionRole(type: string): boolean {
    return this.authoritiesService.hasAuthority(PromotionRoleEnum._POST_PATCH_PROMOTION) && type?.startsWith('PROMOTION');
  }

  hasCreatePromotionRole() {
    return this.authoritiesService.hasAuthority('post/promotions');
  }

  hasUpdatePromotionRole() {
    return this.authoritiesService.hasAuthority('patch/promotions/{id}') && this.hasGetPromotionRole();
  }

  hasGetPromotionRole() {
    return this.authoritiesService.hasAuthority('get/promotions/{id}')
  }

  hasCreateOrUpdatePromotionRole() {
    return this.hasCreatePromotionRole() || this.hasUpdatePromotionRole();
  }

  hasApprovePromotionRole() {
    return this.authoritiesService.hasAuthority('patch/promotions/{id}/accept') && this.hasGetPromotionRole();
  }

  hasRejectPromotionRole() {
    return this.authoritiesService.hasAuthority('patch/promotions/{id}/reject') && this.hasGetPromotionRole();
  }

  hasApproveOrRejectPromotionRole() {
    return this.hasApprovePromotionRole() || this.hasRejectPromotionRole();
  }

  hasGetPromotionLevelRole(){
    return this.authoritiesService.hasAuthority('get/promotions/{promotionId}/level/{promotionLevelId}');
  }

  hasUpdateLevelMappingSellRewardsRole(){
    return this.authoritiesService.hasAuthority('patch/promotions/{promotionId}/level/{promotionLevelId}')
  }

  hasUpdatePromotionLevelRole(){
    return this.authoritiesService.hasAuthority('patch/promotions/{id}/level')
  }

  hasDeletePromotionLevelRole(){
    return this.authoritiesService.hasAuthority('delete/promotions/{id}/level')
  }
}
