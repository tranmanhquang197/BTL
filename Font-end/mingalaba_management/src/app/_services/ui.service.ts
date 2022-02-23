import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private toastrService: ToastrService,
              private matDialog: MatDialog,
              private translateService: TranslateService) {
    this.toastrService.toastrConfig.positionClass = 'toast-bottom-right';
  }

  showSuccessMsg(key: string | undefined) {
    this.toastrService.success(key);
  }

  showWarningMsg(key: string) {
    this.toastrService.warning(key);
  }

  showErrorMsg(key: string | undefined) {
    this.toastrService.error(key);
  }

  showInfoMsg(key: string) {
    this.toastrService.info(key);
  }

  showNotificationOrder(message: string, title: string, action: () => void) {
    this.toastrService.show(message, title, {
      disableTimeOut: false,
      tapToDismiss: true,
      closeButton: true,
      toastClass: 'toast-info '
    }).onAction.subscribe(next => {
      action();
    });
  }
}
