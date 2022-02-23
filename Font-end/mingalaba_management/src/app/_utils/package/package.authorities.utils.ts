import {AuthoritiesService} from '@next-solutions/next-solutions-base';
import {Injectable} from '@angular/core';
import {PackageStatusEnum} from '../../_models/enums/package.status.enum';
import {Package} from '../../_models/package.model';

@Injectable({providedIn: 'root'})
export class PackageAuthoritiesUtils {
  constructor(private authoritiesService: AuthoritiesService) {
  }

  static isAcceptedStatus(_package: Package | null | undefined){
    return !!_package && PackageStatusEnum['_' + _package.status] === PackageStatusEnum._ACCEPTED
  }

  static isRejectStatus(_package: Package | null | undefined){
    return !!_package &&  PackageStatusEnum['_' + _package.status] === PackageStatusEnum._REJECTED
  }

  static isDraftStatus(_package: Package | null | undefined){
    return !!_package &&  PackageStatusEnum['_' + _package.status] ===  PackageStatusEnum._DRAFT
  }

  hasGetPackageRole(){
    return this.authoritiesService.hasAuthority('get/packages/{id}');
  }

  hasCreatePackageRole(){
    return this.authoritiesService.hasAuthority('post/packages');
  }

  hasUpdatePackageRole(){
    return this.authoritiesService.hasAuthority('patch/packages/{id}');
  }

  hasAcceptPackageRole(){
    return this.authoritiesService.hasAuthority('patch/packages/{id}/accept');
  }

  hasRejectPackageRole(){
    return this.authoritiesService.hasAuthority('patch/packages/{id}/reject');
  }

}
