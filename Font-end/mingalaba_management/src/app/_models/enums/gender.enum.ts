import { BillLadingOrderModel } from '../bill-order/bill.lading.order.model';

export enum GenderEnum {
  _ = 'none',
  _male = 'male',
  _female='female',
  _all = 'all',
}
export const genderEnum = {
  _: {
    label: 'none',
    btnClass: 'mat-cell viewData all',
    code: '',
    enum:GenderEnum._
  },

  _male: {
    code: 'male',
    label: 'male',
    btnClass: 'mat-cell viewData pending mat-state-button',
    enum:GenderEnum._male
  },
  _female: {
    code: 'female',
    label: 'female',
    btnClass: 'mat-cell viewData approved mat-state-button',
    enum:GenderEnum._female
  },
  _other : {
    code: 'all',
    label: 'all',
    btnClass: 'mat-cell viewData ongoing mat-state-button',
    style: 'viewData ongoing mat-state-button',
      enum:GenderEnum._all
  }
};

export const genderEnumAction = {
  getGenderLabel(gender: string | undefined ) {
    if (typeof gender === 'string') {
      return !gender ? '' : genderEnum[('_'+gender + '')].label;
    }
    return !gender ? '' : genderEnum[('_'+gender + '')].label;
  },
  getGenderCode(gender: string | undefined ) {
    if (typeof gender === 'string') {
      return !gender ? '' : genderEnum[gender + ''].code;
    }
    return !gender ? '' : genderEnum[gender + ''].code;
  },
  isNone: (gender:string | undefined) => {
    return !!gender && genderEnum[gender + '']?.enum === GenderEnum._;
  },
  isMale: (gender:string | undefined) => {
    return !!gender && genderEnum[gender + '']?.enum === GenderEnum._male;
  },
  isFemale: (gender: string | undefined) => {
    return !!gender && genderEnum[gender + '']?.enum === GenderEnum._female;
  },
  isOther: (gender: string | undefined) => {
    return !!gender && genderEnum[gender + '']?.enum === GenderEnum._all;
  },
}
