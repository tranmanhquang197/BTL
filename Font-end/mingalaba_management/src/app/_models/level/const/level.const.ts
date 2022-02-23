import {Level} from "../level.model";

export const levelStatus = {
  DRAFT: {
    label: 'level.status.draft'
  },
  ACCEPTED: {
    label: 'level.status.accept'
  },
  REJECTED: {
    label: 'level.status.reject'
  },
};

export const levelStatusAction = {
  getStatusLabel(level: string | undefined | Level) {
    if (typeof level === 'string') {
      return !level ? '' : levelStatus[level + ''].label;
    }
    return !level?.status ? '' : levelStatus[level.status + ''].label;
  },
  isDraftStatus(level: Level | string | undefined): boolean {
    if (typeof level === 'string') {
      return !!level && levelStatus[level + ''] === levelStatus.DRAFT;
    }
    return !!level && levelStatus[level.status + ''] === levelStatus.DRAFT;
  },
  isAcceptedStatus(level: Level | string | undefined): boolean {
    if (typeof level === 'string') {
      return !!level && levelStatus[level + ''] === levelStatus.ACCEPTED;
    }
    return !!level && levelStatus[level.status + ''] === levelStatus.ACCEPTED;
  },
  isRejectedStatus(level: Level | string | undefined): boolean {
    if (typeof level === 'string') {
      return !!level && levelStatus[level + ''] === levelStatus.REJECTED;
    }
    return !!level && levelStatus[level.status + ''] === levelStatus.REJECTED;
  }
}
