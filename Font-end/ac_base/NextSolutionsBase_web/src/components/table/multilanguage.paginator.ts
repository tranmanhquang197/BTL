import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MultilanguagePanigator extends MatPaginatorIntl {
  constructor(private translateService: TranslateService) {
    super();
    this.translateService.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });
    this.getAndInitTranslations();
  }

  range: string = '';

  getAndInitTranslations() {
    this.translateService.get('MatPaginator.itemsPerPageLabel').subscribe((res: string) => {
      this.itemsPerPageLabel = res;
    });
    this.translateService.get('MatPaginator.nextPageLabel').subscribe((res: string) => {
      this.nextPageLabel = res;
    });
    this.translateService.get('MatPaginator.previousPageLabel').subscribe((res: string) => {
      this.previousPageLabel = res;
    });
    this.translateService.get('MatPaginator.range').subscribe((res: string) => {
      this.range = ' ' + res + ' ';
    });
    this.changes.next();
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    // use style-paginator directive
    return '';

    // if (length === 0 || pageSize === 0) {
    //   return '0' + this.range + length;
    // }
    // length = Math.max(length, 0);
    // const startIndex = page * pageSize;
    // const endIndex = startIndex < length ?
    //   Math.min(startIndex + pageSize, length) :
    //   startIndex + pageSize;
    // return startIndex + 1 + ' - ' + endIndex + this.range + length;
  };

}
