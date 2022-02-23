import {Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {
  AlignEnum,
  ApiService,
  AuthoritiesService,
  ButtonFields,
  ColumnFields,
  ColumnTypes,
  DateUtilService, DialogTypeEnum,
  FormStateService, IconTypeEnum, SelectModel,
  UtilsService
} from '@next-solutions/next-solutions-base';
import {FormBuilder} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from './shared/user.service';
import {MangoHitBaseSearch} from '../../base/mango-hit-base-search';
import {Apollo} from 'apollo-angular';
import {MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent extends MangoHitBaseSearch implements OnInit {
  name = 'Angular';
  @ViewChild('videoPlayer', {static: false}) videoplayer?: ElementRef;
  isPlay = false;

  moduleName = 'user-management';
  columns: ColumnFields[] = [];
  button: ButtonFields[] = [];

  statusOptions: SelectModel[] = [];
  typeSelectOptions: SelectModel[] = [];

  constructor(protected formBuilder: FormBuilder,
              protected router: Router,
              protected apiService: ApiService,
              protected utilsService: UtilsService,
              protected uiStateService: FormStateService,
              protected translateService: TranslateService,
              protected injector: Injector,
              protected activatedRoute: ActivatedRoute,
              protected authoritiesService: AuthoritiesService,
              protected dateServiceUtil: DateUtilService,
              private userService: UserService,
              protected apollo: Apollo) {
    super(formBuilder, router, apiService, utilsService, uiStateService,
      translateService, injector, activatedRoute, authoritiesService, dateServiceUtil, apollo);
    this.searchForm = this.formBuilder.group({
      displayName: [undefined],
      status: [undefined],
      type: [undefined],
      phoneNumber: [undefined]
    });
    this.columns.push(
      {
        columnDef: 'number', header: 'number',
        title: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
        cell: (e: any) => `${UtilsService.calcPosition(e, this.results, this.paging)}`,
        className: 'mat-column-stt',
        align: AlignEnum.CENTER,
      },
      {
        columnDef: 'displayName', header: 'displayName',
        title: (e: any) => `${e.display_name ? e.display_name : ''}`,
        cell: (e: any) => `${e.display_name ? e.display_name : ''}`,
        className: 'mat-column-displayName',
      },
      {
        columnDef: 'avatar', header: 'avatar',
        title: (e: any) => `${e.avatar}`,
        cell: (e: any) => `${e.avatar}`,
        className: 'mat-column-avatar',
        columnType: ColumnTypes.BASE64
      },
      {
        columnDef: 'birthday', header: 'birthday',
        title: (e: any) => `${e.birthday ? e.birthday : ''}`,
        cell: (e: any) => `${e.birthday ? e.birthday : ''}`,
        className: 'mat-column-birthday',
      },
      {
        columnDef: 'sex', header: 'sex',
        title: (e: any) => `${e.sex ? this.translateService.instant('user-management.sex.' + e.sex) : ''}`,
        cell: (e: any) => `${e.sex ? this.translateService.instant('user-management.sex.' + e.sex) : ''}`,
        className: 'mat-column-sex',
      },
      {
        columnDef: 'status', header: 'status',
        title: (e: any) => `${this.translateService.instant('user-management.status.' + e.active)}`,
        cell: (e: any) => `${this.translateService.instant('user-management.status.' + e.active)}`,
        className: 'mat-column-status',
      },
      {
        columnDef: 'typeUser', header: 'typeUser',
        title: (e: any) => `${this.translateService.instant('user-management.type.' + e.user_type)}`,
        cell: (e: any) => `${this.translateService.instant('user-management.type.' + e.user_type)}`,
        className: 'mat-column-typeUser',
      },
      {
        columnDef: 'dateBecomeHit', header: 'dateBecomeHit',
        title: (e: any) => `${e.dateBecomeHit ? e.dateBecomeHit : ''}`,
        cell: (e: any) => `${e.dateBecomeHit ? e.dateBecomeHit : ''}`,
        className: 'mat-column-dateBecomeHit',
      },
    );
    this.button.push(
      {
        columnDef: 'view',
        color: 'warn',
        icon: 'fa fa-eye',
        iconType: IconTypeEnum.FONT_AWESOME,
        className: 'info',
        click: 'view',
        title: 'common.tooltip.view',
        isShowHeader: true,
        display: (_: any) => true,
      },
      {
        columnDef: 'pause',
        color: 'warn',
        icon: 'fa fa-ban',
        iconType: IconTypeEnum.FONT_AWESOME,
        click: 'pause',
        isShowHeader: true,
        className: 'danger',
        header: 'common.label.action',
        title: 'user-management.title.inactive',
        display: (e: any) => true
      },
      {
        columnDef: 'done_all',
        color: 'warn',
        iconType: IconTypeEnum.FONT_AWESOME,
        icon: 'fas fa-play',
        click: 'reactive',
        isShowHeader: true,
        title: 'user-management.title.reactivate',
        className: 'primary',
        display: (e: any) => true
      },
      {
        columnDef: 'reset',
        color: 'warn',
        icon: 'fa fa-sync-alt',
        iconType: IconTypeEnum.FONT_AWESOME,
        click: 'reset',
        isShowHeader: true,
        title: 'user-management.title.resetPass',
        className: 'secondary',
        display: (e: any) => true
      }
    );

  }

  ngOnInit(): void {
    for (let i = 0; i< 2; i++) {
      this.statusOptions.push(new SelectModel(i, this.translateService.instant('user-management.status.' + i)));
      this.typeSelectOptions.push(new SelectModel(i, this.translateService.instant('user-management.type.' + i)));
    }
    super.ngOnInit();
    super.onSubmit();
  }

  resetSearchFormValue(): void {
    this.searchForm.patchValue({
      displayName: undefined,
      status: '',
      type: '',
      phoneNumber: undefined
    })
  }

  search(): void {
    const {displayName, phoneNumber, status, type} = this.searchForm.value;
    console.log(status);
    this.customFilterData(this.userService.GET_ALL, {
      displayName: displayName ? displayName : null,
      active: status !== null && status !== undefined && status !== '' ? !!status : null,
      phoneNumber : phoneNumber ? phoneNumber : null,
      type: type && type !== '' ? type: null
    })
  }

  reactive(element: any) {
    const strOk = this.translateService.instant('common.OK');
    const strCancel = this.translateService.instant('common.Cancel');
    const dialogConfig: MatDialogConfig<any> = {
      data: {
        customClass: 'reject_reason_dialog',
        msg: this.translateService.instant('common.action*.4'),
        msgDetail: this.translateService.instant('staff-distributor.message.confirm.reactivate.content'),
        type: DialogTypeEnum.CONFIRM,
        btnOKString: strOk,
        btnCancelString: strCancel,
      }
    };

    this.utilsService.showConfirmDialog('user-management.message.content.active', [],
      '', [])
      .afterClosed().subscribe(next => {
      if (next && next.value === 1) {
        this.userService.updateActiveUser(element.id, true).subscribe(_ => {
          this.onSuccessFunc(null, 'common.success');
          this.search();
        }, _ => {
          this.utilsService.showErrorToarst('common.error');
        });
      }
    });
  }

  pause(element: any) {
    const strOk = this.translateService.instant('common.OK');
    const strCancel = this.translateService.instant('common.Cancel');
    const dialogConfig: MatDialogConfig<any> = {
      data: {
        customClass: this.translateService.instant('common.tooltip.reasonReject'),
        msg: 'Reasons for deactivate',
        type: 'INPUT_CONFIRM',
        btnOKString: strOk,
        btnCancelString: strCancel,
      }
    };

    this.utilsService.showConfirmDialog('user-management.message.content.inactive', [],
      '', [])
      .afterClosed()
      .subscribe(next => {
      if (next && next.value === 1) {
        this.userService.updateActiveUser(element.id, false).subscribe(_ => {
          this.onSuccessFunc(null, 'common.success');
          this.search();
        }, _ => {
          this.utilsService.showErrorToarst('common.error');
        });
      }
    });
  }

  view(e: any) {
    this.router.navigate(['view', e.id], {relativeTo: this.activatedRoute});
  }
  toggleVideo(event: any) {
    this.videoplayer?.nativeElement.play();
  }

  playPause() {
    const myVideo: any = document.getElementById('my_video_1');
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }

  makeBig() {
    const myVideo: any = document.getElementById('my_video_1');
    myVideo.width = 560;
  }

  makeSmall() {
    const myVideo: any = document.getElementById('my_video_1');
    myVideo.width = 320;
  }

  makeNormal() {
    const myVideo: any = document.getElementById('my_video_1');
    myVideo.width = 420;
  }

  skip(value: any) {
    const video: any = document.getElementById('my_video_1');
    video.currentTime += value;
  }

  restart() {
    const video: any = document.getElementById('my_video_1');
    video.currentTime = 0;
  }
}
