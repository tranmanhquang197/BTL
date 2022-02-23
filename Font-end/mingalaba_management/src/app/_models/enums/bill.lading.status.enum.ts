import { BillLadingOrderModel } from '../bill-order/bill.lading.order.model';

export enum BillLadingStatusEnum {
  _ALL = 'history-order.status.all',
  _DRAFT = 'history-order.status.draft',
  _RUNNING = 'history-order.status.running',
  _DELETED = 'history-order.status.deleted',
  _FINISHED = 'history-order.status.finished',
}
export const billLadingStatus = {
  _ALL: {
    label: 'history-order.status.all', btnClass: 'mat-cell viewData all',
    code: 'all',
  },

  _DRAFT: {
    code: 'draft',
    label: 'history-order.status.draft',
    btnClass: 'mat-cell viewData pending mat-state-button',
    style: 'viewData mat-state-button pending',
    statusType:BillLadingStatusEnum._DRAFT
  },
  _RUNNING: {
    code: 'running',
    label: 'history-order.status.running',
    btnClass: 'mat-cell viewData approved mat-state-button',
    style: 'viewData approved mat-state-button',
    statusType:BillLadingStatusEnum._RUNNING
  },
  _FINISHED : {
    code: 'finished',
    label: 'history-order.status.finished',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button',
    statusType:BillLadingStatusEnum._FINISHED
  },
  _DELETED: {
    code: 'deleted',
    label: 'history-order.status.deleted',
    btnClass: 'mat-cell viewData closed mat-state-button',
    style: 'viewData closed mat-state-button',
    statusType:BillLadingStatusEnum._DELETED
  },

};
export const billLadingStatusAction = {
  getStatusLabel(status: string | undefined | BillLadingOrderModel) {
    if (typeof status === 'string') {
      return !status ? '' : billLadingStatus[('_'+status + '').toUpperCase()].label;
    }
    return !status?.status ? '' : billLadingStatus[('_'+status + '').toUpperCase()].label;
  },
  getStatusCode(status: string | undefined | BillLadingOrderModel) {
    if (typeof status === 'string') {
      return !status ? '' : billLadingStatus[status + ''].code;
    }
    return !status?.status ? '' : billLadingStatus[status + ''].code;
  },
  isDraftStatus: (billLading: BillLadingOrderModel | undefined) => {
    return !!billLading && billLadingStatus[billLading.status + '']?.statusType === BillLadingStatusEnum._DRAFT;
  },
  isRunningStatus: (billLading: BillLadingOrderModel | undefined) => {
    return !!billLading && billLadingStatus[billLading.status + '']?.statusType === BillLadingStatusEnum._RUNNING;
  },
  isDeleteStatus: (billLading: BillLadingOrderModel | undefined) => {
    return !!billLading && billLadingStatus[billLading.status + '']?.statusType === BillLadingStatusEnum._DELETED;
  },
  isFinishStatus: (billLading: BillLadingOrderModel | undefined) => {
    return !!billLading && billLadingStatus[billLading.status + '']?.statusType === BillLadingStatusEnum._FINISHED;
  },
}
