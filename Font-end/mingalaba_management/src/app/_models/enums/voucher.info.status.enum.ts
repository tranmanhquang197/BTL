import { BillLadingOrderModel } from '../bill-order/bill.lading.order.model';
import { Voucher } from '../voucher/voucher.model';
import { voucherStatus, VoucherStatusEnum } from './voucher.status.enum';

export enum voucherInfoStatusEnum {
  _NOT_RECEIVED = 'NOT_RECEIVED',
  _RECEIVED = 'RECEIVED',
  _DELETED = 'DELETED'
}

export const voucherInfoStatus = {
  _NOT_RECEIVED: {
    label: 'voucher-management.infor-status.not-received',
    btnClass: 'mat-cell viewData all',
    code: 'all',
    style: 'viewData approved mat-state-button',
    statusType: voucherInfoStatusEnum._NOT_RECEIVED,
  },

  _RECEIVED: {
    code: 'pending',
    label: 'voucher-management.infor-status.received',
    btnClass: 'mat-cell viewData approved mat-state-button',
    style: 'viewData approved mat-state-button',
    statusType: voucherInfoStatusEnum._RECEIVED,
  },
  _DELETED: {
    code: 'out_of_date',
    label: 'voucher-management.infor-status.deleted',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button',
    statusType: voucherInfoStatusEnum._DELETED,
  }


};
export const voucherInfoStatusAction = {
  getStatusLabel(status: string | undefined | Voucher) {
    if (typeof status === 'string') {
      if (status === '0') return !status ? '' : voucherInfoStatus[('_' + voucherInfoStatusEnum._DELETED + '').toUpperCase()].label;
      if (status === '1') return !status ? '' : voucherInfoStatus[('_' + voucherInfoStatusEnum._NOT_RECEIVED + '').toUpperCase()].label;
      if (status === '2') return !status ? '' : voucherInfoStatus[('_' + voucherInfoStatusEnum._RECEIVED + '').toUpperCase()].label;

      return !status ? '' : voucherInfoStatus[('_' + status + '').toUpperCase()].label;
    }
    return !status?.status ? '' : voucherInfoStatus[('_' + status + '').toUpperCase()].label;
  }
}
