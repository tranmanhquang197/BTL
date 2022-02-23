import { BillLadingStatusEnum } from './bill.lading.status.enum';

export enum UserRoleEnum {
    _ALL = -1,
    _ADMIN = 0,
    _NOMARL = 1,
}

export enum UserRoleLabelEnum {
    _ALL = '_ALL',
    _ADMIN = '_ADMIN',
    _NOMARL = '_NOMARL',
}

export const userRoleStatus = {
    _ALL: {
        label: 'users.status.all',
        style: 'viewData approved mat-state-button',
        statusType: UserRoleEnum._ALL,
    },
    _ADMIN: {
        label: 'users.status.admin',
        style: 'viewData approved mat-state-button',
        statusType: UserRoleEnum._ADMIN,
    },
    _NOMARL: {
        label: 'users.status.nomarl',
        style: 'viewData approved mat-state-button',
        statusType: UserRoleEnum._NOMARL,
    },
};


export enum UserStatusEnum {
    _ALL = -1,
    _UNBLOCK = 0,
    _BLOCK = 1,
}

export enum UserStatusLabelEnum {
    _ALL = '_ALL',
    _ACTIVE = '_ACTIVE',
    _DEACTIVE = '_DEACTIVE',
}

export const userStatus = {
    _ALL: {
        label: 'users.status.all',
        style: 'viewData approved mat-state-button',
        statusType: UserStatusEnum._ALL,
    },
    _ACTIVE: {
        label: 'users.status.unblock',
        style: 'viewData approved mat-state-button',
        statusType: UserStatusEnum._UNBLOCK,
    },
    _DEACTIVE: {
        label: 'users.status.block',
        style: 'viewData approved mat-state-button',
        statusType: UserStatusEnum._BLOCK,
    },
};

export enum UserSystemEnum {
    _ALL = 3,
    _INSYSTEM = 1,
    _OUTSYSTEM = 2,
}

export enum UserSystemLabelEnum {
    _ALL = '_ALL',
    _INSYSTEM = '_INSYSTEM',
    _OUTSYSTEM = '_OUTSYSTEM',
}

export const UserSystemStatus = {
    _ALL: {
        label: 'customer-care.status.system.all',
        style: 'viewData approved mat-state-button',
        statusType: UserSystemEnum._ALL,
    },
    _INSYSTEM: {
        label: 'customer-care.status.system.insystem',
        style: 'viewData approved mat-state-button',
        statusType: UserSystemEnum._INSYSTEM,
    },
    _OUTSYSTEM: {
        label: 'customer-care.status.system.outsystem',
        style: 'viewData approved mat-state-button',
        statusType: UserSystemEnum._OUTSYSTEM,
    },
};

