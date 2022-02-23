import { Voucher } from '../voucher.model';
import { voucherStatus, VoucherStatusEnum } from '../../enums/voucher.status.enum';

export enum GenderEnum {
  _MALE = 'voucher-management.label.male',
  _FEMALE = 'voucher-management.label.female',
  _ALL = 'voucher-management.label.other'

}

export const genderStatus = {

  _MALE: {
    code: 'male',
    label: 'voucher-management.label.male',
    btnClass: 'mat-cell viewData approved mat-state-button',
    style: 'viewData approved mat-state-button',
    statusType: GenderEnum._MALE,
  },
  _FEMALE: {
    code: 'female',
    label: 'voucher-management.label.female',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button',
    statusType: GenderEnum._FEMALE,
  },
  _ALL: {
    code: 'all',
    label: 'voucher-management.label.all',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button',
    statusType: GenderEnum._ALL,
  },


};

export const genderAction = {
  getStatusLabel(key: string | undefined ) {
    if (typeof key === 'string') {
      if (key == 'male') return !key ? '' : genderStatus[('_' + GenderEnum._MALE + '').toUpperCase()].label;
      if (key == 'female') return !key ? '' : genderStatus[('_' + GenderEnum._FEMALE + '').toUpperCase()].label;
      if (key == 'all') return !key ? '' : genderStatus[('_' + GenderEnum._ALL + '').toUpperCase()].label;

      return !key ? '' : genderStatus[('_' + key + '').toUpperCase()].label;
    }
    return '';
  },

}

