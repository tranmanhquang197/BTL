import {PromotionRoleEnum} from '../../_models/promotion/enums/promotion.role.enum';
import {AuthoritiesService} from '@next-solutions/next-solutions-base';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PolicyAuthoritiesUtils {
  constructor(private authoritiesService: AuthoritiesService) {
  }

  hasGetPolicyRole(): boolean {
    return this.authoritiesService.hasAuthority('get/policies/{id}');
  }

  hasCreatePolicyRole(): boolean {
    return this.authoritiesService.hasAuthority('post/policies');
  }

  hasUpdatePolicyRole(): boolean {
    return this.authoritiesService.hasAuthority('patch/policies/{id}') && this.hasGetPolicyRole();
  }

  hasCreateOrUpdatePolicyRole(): boolean {
    return this.hasUpdatePolicyRole() || this.hasCreatePolicyRole();
  }

  hasCreateAndUpdatePolicyRole(): boolean {
    return this.hasUpdatePolicyRole() && this.hasCreatePolicyRole();
  }

  hasImportExcelPolicyRole(): boolean {
    return this.authoritiesService.hasAuthority('post/policies/import-policy');
  }
  hasDownloadTemplateExcelPolicyRole(): boolean {
    return this.authoritiesService.hasAuthority('post/policies/download-template');
  }

}
