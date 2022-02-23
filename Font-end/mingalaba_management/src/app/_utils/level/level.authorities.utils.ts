import {AuthoritiesService} from '@next-solutions/next-solutions-base';
import {Injectable} from '@angular/core';

@Injectable()
export class LevelAuthoritiesUtils {
  constructor(private authoritiesService: AuthoritiesService) {
  }

  hasGetLevelRole(){
    return this.authoritiesService.hasAuthority('get/levels/{id}');
  }

  hasCreateLevelRole(){
    return this.authoritiesService.hasAuthority('post/levels');
  }

  hasUpdateLevelRole(){
    return this.authoritiesService.hasAuthority('patch/levels/{id}');
  }

  hasAcceptLevelRole(){
    return this.authoritiesService.hasAuthority('patch/levels/{id}/accept');
  }

  hasRejectLevelRole(){
    return this.authoritiesService.hasAuthority('patch/levels/{id}/reject');
  }

}
