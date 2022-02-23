import { BillLadingStatusEnum } from './bill.lading.status.enum';

export enum ReportUserStatusEnum {
    _ALL = -1,
    _PROCESS = 1,
    _NOPROCESS = 2,
}

export const ReportUserStatus = {
    _ALL: {
        label: 'report-users.status.all',
        style: 'viewData approved mat-state-button',
        statusType: ReportUserStatusEnum._ALL,
    },
    _PROCESS: {
        label: 'report-users.status.process',
        style: 'viewData approved mat-state-button',
        statusType: ReportUserStatusEnum._PROCESS,
    },
    _NOPROCESS: {
        label: 'report-users.status.noprocess',
        style: 'viewData approved mat-state-button',
        statusType: ReportUserStatusEnum._NOPROCESS,
    },
};


export enum ReportUserTypeEnum {
    _ALL = -1,
    _USER = 1,
    _POST = 2,
    _COMMENT = 3,
}



export const ReportUserType = {
    _ALL: {
        label: 'report-users.type.all',
        style: 'viewData approved mat-state-button',
        statusType: ReportUserTypeEnum._ALL,
    },
    _USER: {
        label: 'report-users.type.user',
        style: 'viewData approved mat-state-button',
        statusType: ReportUserTypeEnum._USER,
    },
    _POST: {
        label: 'report-users.type.post',
        style: 'viewData approved mat-state-button',
        statusType: ReportUserTypeEnum._POST,
    },
    _COMMENT: {
        label: 'report-users.type.comment',
        style: 'viewData approved mat-state-button',
        statusType: ReportUserTypeEnum._COMMENT,
    },
};


