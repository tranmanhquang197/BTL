import {AuthoritiesService} from '@next-solutions/next-solutions-base';
import {Inject, Injectable} from '@angular/core';

@Injectable()
export class MstoreCampaignAuthoritiesUtils {
  constructor(private authoritiesService: AuthoritiesService) {
  }

  hasCreateMstoreCampaignRole() {
    return this.authoritiesService.hasAuthority('post/campaigns');
  }

  hasUpdateMstoreCampaignRole() {
    return this.authoritiesService.hasAuthority('patch/campaigns/{id}') && this.hasGetMstoreCampaignRole();
  }

  hasGetMstoreCampaignRole() {
    return this.authoritiesService.hasAuthority('get/campaigns/{id}')
  }

  hasCreateOrUpdateMstoreCampaignRole() {
    return this.hasCreateMstoreCampaignRole() || this.hasUpdateMstoreCampaignRole();
  }

  hasApproveMstoreCampaignRole() {
    return this.authoritiesService.hasAuthority('patch/campaigns/{id}/accept') && this.hasGetMstoreCampaignRole();
  }

  hasRejectMstoreCampaignRole() {
    return this.authoritiesService.hasAuthority('patch/campaigns/{id}/reject') && this.hasGetMstoreCampaignRole();
  }

  hasApproveOrRejectMstoreCampaignRole() {
    return this.hasApproveMstoreCampaignRole() || this.hasRejectMstoreCampaignRole();
  }

  hasRegistrationMstoreCampaignRole() {
    return this.authoritiesService.hasAuthority('post/campaigns/{id}/register') && this.hasGetMstoreCampaignRole();
  }

}
