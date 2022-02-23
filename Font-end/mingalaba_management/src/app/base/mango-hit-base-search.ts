import {
  ApiService,
  AuthoritiesService,
  BaseSearchLayout, ColumnFields,
  DateUtilService,
  FormStateService, Paging, SuperEntity,
  UtilsService
} from '@next-solutions/next-solutions-base';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Injector} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {DocumentNode} from 'graphql';
import {MatTableDataSource} from '@angular/material/table';

export class MangoHitBaseSearch extends BaseSearchLayout {

  constructor(protected formBuilder: FormBuilder,
              protected router: Router,
              protected apiService: ApiService,
              protected utilsService: UtilsService,
              protected uiStateService: FormStateService,
              protected translateService: TranslateService,
              protected injector: Injector,
              protected activatedRoute: ActivatedRoute,
              protected authoritiesService: AuthoritiesService,
              protected dateServiceUtil: DateUtilService,
              protected apollo: Apollo) {
    super(router, apiService, utilsService, uiStateService, translateService, injector, activatedRoute, authoritiesService,
      formBuilder.group({}));
  }

  customFilterData(query: DocumentNode, variable: any) {
    variable.page_number = Number(this.isResetPaging ? '0' : (this.paging ? (this.paging.pageNumber - 1).toString() : '0'));
    variable.page_size = Number(this.paging ? this.paging.pageSize.toString() : this.config.PAGE_SIZE.toString());
    this.apollo.watchQuery({
      query,
      variables: variable
    }).valueChanges
      .subscribe((next: any) => {
        this.isResetPaging = false;
        const data: any = Object.values(next.data)[0];
        if (data?.content && data.content > 0) {
          this.columns.forEach((column: ColumnFields) => {
            column.isShowHeader = false;
          });
        }
          this.results = new MatTableDataSource<SuperEntity>(data?.content);
        this.paging = new Paging();
        this.paging.pageSize = data.size ? data.size : 0;
        this.paging.pageNumber = (data.number ? data.number : 0) + 1;
        this.paging.totalElements = data.totalElements ? data.totalElements : 0;
      })
  }
}
