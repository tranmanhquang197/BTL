import {AuthoritiesService} from '@next-solutions/next-solutions-base';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class KpiAuthoritiesUtils {
  constructor(private authoritiesService: AuthoritiesService) {
  }

  hasGetKpiRole(): boolean {
    return this.authoritiesService.hasAuthority('get/kpis/{id}');
  }

  hasCreateKpiRole(): boolean {
    return this.authoritiesService.hasAuthority('post/kpis');
  }

  hasUpdateKpiRole(): boolean {
    return this.authoritiesService.hasAuthority('patch/kpis/{id}') && this.hasGetKpiRole();
  }

  hasCreateOrUpdateKpiRole(): boolean {
    return this.hasUpdateKpiRole() || this.hasCreateKpiRole();
  }

  hasCreateAndUpdateKpiRole(): boolean {
    return this.hasUpdateKpiRole() && this.hasCreateKpiRole();
  }

  hasApproveKpiRole(): boolean {
    return this.authoritiesService.hasAuthority('patch/kpis/{id}/accept') && this.hasGetKpiRole();
  }

  hasRejectKpiRole(): boolean {
    return this.authoritiesService.hasAuthority('patch/kpis/{id}/reject') && this.hasGetKpiRole();
  }

  hasApproveOrRejectKpiRole(): boolean {
    return this.hasApproveKpiRole() || this.hasRejectKpiRole();
  }

  hasExportExcelRole() {
    return this.authoritiesService.hasAuthority('post/kpis/export-excel');
  }

  hasImportExcelRole() {
    return this.authoritiesService.hasAuthority('post/kpis/import-child-kpi/{id}');
  }

  hasDownloadTemplateExcelRole() {
    return this.authoritiesService.hasAuthority('post/kpis/download-template/{id}');
  }
}
