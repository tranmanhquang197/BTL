import { BillLadingOrderModel } from '../bill-order/bill.lading.order.model';
import { Voucher } from '../voucher/voucher.model';

export enum VoucherStatusEnum {
  _ALL = 'ALL',
  _DELETED = 'DELETED',
  _PENDING = 'PENDING',
  _OUT_OF_DATE = 'OUT_OF_DATE',
  _PUBLISHED  = 'PUBLISHED',
  _APPROVED = 'APPROVED',
}

export const voucherStatus = {
  _ALL: {
    label: 'voucher-management.status.all',
    btnClass: 'mat-cell viewData all',
    code: 'all',
    style: 'viewData approved mat-state-button',
    statusType: VoucherStatusEnum._ALL,
  },

  _PENDING: {
    code: 'pending',
    label: 'voucher-management.status.pending',
    btnClass: 'mat-cell viewData approved mat-state-button',
    style: 'viewData approved mat-state-button',
    statusType: VoucherStatusEnum._PENDING,
  },
  _OUT_OF_DATE: {
    code: 'out_of_date',
    label: 'voucher-management.status.out_of_date',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button',
    statusType: VoucherStatusEnum._OUT_OF_DATE,
  },
  _DELETED: {
    code: 'deleted',
    label: 'voucher-management.status.deleted',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button',
    statusType: VoucherStatusEnum._DELETED,
  },
  _APPROVED: {
    code: 'approved',
    label: 'voucher-management.status.approved',
    btnClass: 'mat-cell viewData closed mat-state-button',
    style: 'viewData closed mat-state-button',
    statusType: VoucherStatusEnum._APPROVED,
  },
  _PUBLISHED:{
    code: 'published',
    label: 'voucher-management.status.published',
    btnClass: 'mat-cell viewData closed mat-state-button',
    style: 'viewData closed mat-state-button',
    statusType: VoucherStatusEnum._APPROVED,
  }

};
export const voucherStatusAction = {
  getStatusLabel(status: string | undefined | Voucher) {
    if (typeof status === 'string') {
      if (status == '0') return !status ? '' : voucherStatus[('_' + VoucherStatusEnum._ALL + '').toUpperCase()].label;
      if (status == '1') return !status ? '' : voucherStatus[('_' + VoucherStatusEnum._PENDING + '').toUpperCase()].label;
      if (status == '2') return !status ? '' : voucherStatus[('_' + VoucherStatusEnum._APPROVED + '').toUpperCase()].label;
      if (status == '3') return !status ? '' : voucherStatus[('_' + VoucherStatusEnum._PUBLISHED + '').toUpperCase()].label;
      if (status == '4') return !status ? '' : voucherStatus[('_' + VoucherStatusEnum._OUT_OF_DATE + '').toUpperCase()].label;

      return !status ? '' : voucherStatus[('_' + status + '').toUpperCase()].label;
    }
    return !status?.status ? '' : voucherStatus[('_' + status + '').toUpperCase()].label;
  },
  getStatusCode(status: string | undefined | Voucher) {
    if (typeof status === 'string') {
      return !status ? '' : voucherStatus[status + ''].code;
    }
    return !status?.status ? '' : voucherStatus[status + ''].code;
  },
  isDeletedStatus: (voucher: Voucher | undefined) => {
    return !!voucher && voucherStatus[voucher.status + '']?.statusType === VoucherStatusEnum._ALL;
  },
  isPendingStatus: (voucher: Voucher | undefined) => {
    return !!voucher && voucherStatus[voucher.status + '']?.statusType === VoucherStatusEnum._PENDING;
  },
  isApproveStatus: (voucher: Voucher | undefined) => {
    return !!voucher && voucherStatus[voucher.status + '']?.statusType === VoucherStatusEnum._OUT_OF_DATE;
  },
  isOutOfDateStatus: (voucher: Voucher | undefined) => {
    return !!voucher && voucherStatus[voucher.status + '']?.statusType === VoucherStatusEnum._APPROVED;
  },
};
