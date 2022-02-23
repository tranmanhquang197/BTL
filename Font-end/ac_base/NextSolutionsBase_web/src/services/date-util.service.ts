import { Injectable, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InjectTokenNextSolutionsConfig, NextSolutionsConfig } from '../modules/next.solutions.config';

@Injectable()
export class DateUtilService {

  config: NextSolutionsConfig;

  DIS_DATE_TIME_FORMAT_DEFAULT = 'dd/MM/yyyy HH:mm';

  constructor(private datePipe: DatePipe, private injector: Injector) {
    this.config = injector.get(InjectTokenNextSolutionsConfig);
  }

  getDateNow(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  convertToStartOfDate(dateString: string): Date {
    const currentDate = this.convertToDateIgnoreTimeZone(dateString);
    if(currentDate){
        return new Date(currentDate.getFullYear(), currentDate.getMonth(),currentDate.getDate(), 0,0,0);
    }
    return new Date(1900, 1, 1)
  }

  convertDateToStringCurrentGMT(date: Date): string | null {
    return this.datePipe.transform(date, this.config.API_DATE_FORMAT);
  }

  convertDateToStringGMT0(date: Date | string): string | null {
    return this.datePipe.transform(date, this.config.API_DATE_FORMAT, '-0');
  }

  convertDateToDisplayGMT0(date: string): string | null {
    return this.datePipe.transform(date, this.config.DIS_DATE_FORMAT, '-0');
  }

  convertDateToDisplayServerTime(date: string): string | null {
    return this.datePipe.transform(date ? date.replace('Z', '') : '', this.config.DIS_DATE_FORMAT);
  }

  convertDateTimeToDisplay(date: string): string | null {
    return this.datePipe.transform(date.replace('Z', ''),
        this.config.DIS_DATE_TIME_FORMAT ? this.config.DIS_DATE_TIME_FORMAT : this.DIS_DATE_TIME_FORMAT_DEFAULT);
  }

  convertToDateIgnoreTimeZone(dateStr: string | undefined): Date | null {
    if (dateStr!=null) {
      return new Date(dateStr.replace("Z",""));
    } else {
      return null;
    }
  }

  convertStringToDate(date: string): Date {
    return date ? new Date(date.replace(' ', 'T')) : new Date(1900, 1, 1);
  }
}
