import { BillLadingOrderModel } from '../bill-order/bill.lading.order.model';
import { Voucher } from '../voucher/voucher.model';

export enum EvoucherStatusEnum {
  _ALL = 'ALL',
  _DELETED = 'DELETED',
  _PENDING = 'PENDING',
  _OUT_OF_DATE = 'OUT_OF_DATE',
  _PUBLISHED  = 'PUBLISHED',
  _APPROVED = 'APPROVED',
}

export const evoucherStatus = {
  _ALL: {
    label: 'evoucher.status.all',
    btnClass: 'mat-cell viewData all',
    code: 'all',
    style: 'viewData approved mat-state-button',
    statusType: EvoucherStatusEnum._ALL,
  },

  _PENDING: {
    code: 'pending',
    label: 'evoucher.status.pending',
    btnClass: 'mat-cell viewData approved mat-state-button',
    style: 'viewData approved mat-state-button',
    statusType: EvoucherStatusEnum._PENDING,
  },
  _OUT_OF_DATE: {
    code: 'out_of_date',
    label: 'evoucher.status.out_of_date',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button',
    statusType: EvoucherStatusEnum._OUT_OF_DATE,
  },
  _DELETED: {
    code: 'deleted',
    label: 'evoucher.status.deleted',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button',
    statusType: EvoucherStatusEnum._DELETED,
  },
  _APPROVED: {
    code: 'approved',
    label: 'evoucher.status.approved',
    btnClass: 'mat-cell viewData closed mat-state-button',
    style: 'viewData closed mat-state-button',
    statusType: EvoucherStatusEnum._APPROVED,
  },
  _PUBLISHED:{
    code: 'published',
    label: 'evoucher.status.published',
    btnClass: 'mat-cell viewData closed mat-state-button',
    style: 'viewData closed mat-state-button',
    statusType: EvoucherStatusEnum._APPROVED,
  }

};
export const evoucherStatusAction = {
  getStatusLabel(status: string | undefined | Voucher) {
    if (typeof status === 'string') {
      if (status === '0') return !status ? '' : evoucherStatus[('_' + EvoucherStatusEnum._ALL + '').toUpperCase()].label;
      if (status === '1') return !status ? '' : evoucherStatus[('_' + EvoucherStatusEnum._PENDING + '').toUpperCase()].label;
      if (status === '2') return !status ? '' : evoucherStatus[('_' + EvoucherStatusEnum._APPROVED + '').toUpperCase()].label;
      if (status === '3') return !status ? '' : evoucherStatus[('_' + EvoucherStatusEnum._PUBLISHED + '').toUpperCase()].label;
      if (status === '4') return !status ? '' : evoucherStatus[('_' + EvoucherStatusEnum._OUT_OF_DATE + '').toUpperCase()].label;

      return !status ? '' : evoucherStatus[('_' + status + '').toUpperCase()].label;
    }
    return !status?.status ? '' : evoucherStatus[('_' + status + '').toUpperCase()].label;
  },
  getStatusCode(status: string | undefined | Voucher) {
    if (typeof status === 'string') {
      return !status ? '' : evoucherStatus[status + ''].code;
    }
    return !status?.status ? '' : evoucherStatus[status + ''].code;
  },
  isDeletedStatus: (voucher: Voucher | undefined) => {
    return !!voucher && evoucherStatus[voucher.status + '']?.statusType === EvoucherStatusEnum._ALL;
  },
  isPendingStatus: (voucher: Voucher | undefined) => {
    return !!voucher && evoucherStatus[voucher.status + '']?.statusType === EvoucherStatusEnum._PENDING;
  },
  isApproveStatus: (voucher: Voucher | undefined) => {
    return !!voucher && evoucherStatus[voucher.status + '']?.statusType === EvoucherStatusEnum._OUT_OF_DATE;
  },
  isOutOfDateStatus: (voucher: Voucher | undefined) => {
    return !!voucher && evoucherStatus[voucher.status + '']?.statusType === EvoucherStatusEnum._APPROVED;
  },
};
