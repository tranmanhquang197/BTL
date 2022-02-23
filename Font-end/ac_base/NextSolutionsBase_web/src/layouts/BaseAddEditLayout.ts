import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BaseTableLayout } from './BaseTableLayout';
import { UtilsService } from '../services/utils.service';
import { AuthoritiesService } from '../services/authorities.service';

export class BaseAddEditLayout extends BaseTableLayout implements OnInit {

  addEditForm: FormGroup = new FormGroup({});
  isEdit: boolean;
  id: any;

  constructor(protected activatedRoute: ActivatedRoute,
              protected location: Location,
              protected translateService: TranslateService,
              protected utilsService: UtilsService,
              protected authoritiesService: AuthoritiesService) {
    super(activatedRoute, authoritiesService);
    this.isEdit = false;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
    }
  }

  back(): void {
    this.location.back();
  }

  onSuccessFunc = (data: any, onSuccessMessage?: string): void => {
    this.utilsService.onSuccessFunc(onSuccessMessage ? onSuccessMessage : 'common.default.success');
    setTimeout(() => {
      this.back();
    }, 1500);
  };

  hasAuthority() {
    return false;
  }

  getPosition(e: any, arr: any[]) {
    return !!arr && arr.length > 0 ? (arr.indexOf(e) + 1).toString() : '';
  }

}
