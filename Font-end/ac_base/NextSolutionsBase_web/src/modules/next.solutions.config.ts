import { InjectionToken } from '@angular/core';

export interface NextSolutionsConfig {
  BASE_URL: string;
  BASE_AUTHORIZATION_URL: string;
  PAGE_SIZE: number;
  PAGE_SIZE_OPTIONS: number[];
  API_DATE_FORMAT: string;
  DIS_DATE_FORMAT: string;
  DIS_DATE_TIME_FORMAT?: string;
  DIALOG_LOGO?: string;
  NO_IMAGE_AVAILABLE?: string;
}

export const InjectTokenNextSolutionsConfig = new InjectionToken<NextSolutionsConfig>('InjectTokenNextSolutionsConfig');
