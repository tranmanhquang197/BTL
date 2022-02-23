import { AfterViewInit, Injector, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { FormStateService } from '../services/form-state.service';
import { TranslateService } from '@ngx-translate/core';
import { Paging } from '../models/Paging';
import { Subject } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { SuperEntity } from '../models/SuperEntity';
import { ButtonClickModel } from '../models/button.click.model';
import { BaseTableLayout } from './BaseTableLayout';
import { Page } from '../models/Page';
import { InjectTokenNextSolutionsConfig, NextSolutionsConfig } from '../modules/next.solutions.config';
import { ApiService } from '../services/api.service';
import { ColumnFields } from '../models/column.fields';
import { AuthoritiesService } from '../services/authorities.service';

export class BaseSearchLayout extends BaseTableLayout implements OnInit, OnDestroy, AfterViewInit {

  protected moduleName: string = '';
  protected unsubscribe$ = new Subject();
  protected isResetPaging: boolean = true;
  isAdvancedSearch: boolean = false;

  searchForm: FormGroup;
  paging: Paging;
  results: MatTableDataSource<SuperEntity> = new MatTableDataSource<SuperEntity>([]);
  columns: ColumnFields[] = [];

  config: NextSolutionsConfig;

  constructor(protected router: Router,
              protected apiService: ApiService,
              protected utilsService: UtilsService,
              protected formStateService: FormStateService,
              protected translateService: TranslateService,
              protected injector: Injector,
              protected activatedRoute: ActivatedRoute,
              protected authoritiesService: AuthoritiesService,
              protected formGroup: FormGroup) {
    super(activatedRoute, authoritiesService);
    this.searchForm = this.formGroup;
    this.config = injector.get(InjectTokenNextSolutionsConfig);
    this.paging = new Paging();
    this.paging.pageSize = this.config.PAGE_SIZE;
    this.paging.pageNumber = 1;
    this.paging.totalElements = 0;
  }

  ngOnInit(): void {
    this.formStateService.uiState$
      .subscribe((mapState: Map<string, FormGroup>) => {
        if (mapState && mapState.has(this.moduleName)) {
          const stateFormGroup = mapState.get(this.moduleName);
          if (stateFormGroup) {
            const formGroup = UtilsService.cloneAbstractControl(stateFormGroup);
            if (formGroup) {
              if (!this.searchForm) {
                this.searchForm = formGroup;
              } else {
                const formControls = formGroup.controls;
                Object.keys(formControls).forEach(key => {
                  const abstractControl: AbstractControl | null = this.searchForm.get(key);
                  if (abstractControl) {
                    abstractControl.setValue(formControls[key].value);
                  }
                });
              }
            }
          }
        }
      });
  }

  ngAfterViewInit(): void {
    Object.keys(this.searchForm.controls).forEach(key => {
      const abstractControl: AbstractControl | null = this.searchForm.get(key);
      if (abstractControl) {
        abstractControl.valueChanges.subscribe(
          value => {
            this.isResetPaging = true;
          },
        );
      }
    });
  }

  ngOnDestroy(): void {
    let isOK: boolean = false;
    this.formStateService.uiState$.subscribe((mapState: Map<string, FormGroup>) => {
      if (!isOK) {
        isOK = true;
        mapState.set(this.moduleName, this.searchForm);
        this.formStateService.setMapState(mapState);
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
      }
    });
  }


  onSubmit() {
    this.isResetPaging = true;
    this.search();
  }

  search() {
    // Form extends will be override custom by business
  }

  afterSearch = (data: Page) => {
    // Form extends will be override custom by business
  };

  private afterFillData = (data: Page | any) => {
    this.isResetPaging = false;
    if (data.content && data.content.length > 0) {
      this.columns.forEach((column: ColumnFields) => {
        column.isShowHeader = false;
      });
    }
    this.afterSearch(data);
    this.results = new MatTableDataSource<SuperEntity>(data.content);
    this.paging = new Paging();
    this.paging.pageSize = data.size ? data.size : 0;
    this.paging.pageNumber = (data.number ? data.number : 0) + 1;
    this.paging.totalElements = data.totalElements ? data.totalElements : 0;
  };

  private updateHttpParams(params: HttpParams): HttpParams {
    const emptyValuesKey = params.keys().filter(key => !params.get(key));
    emptyValuesKey.forEach(key => {
      params = params.delete(key);
    });
    if (!params.keys().includes('pageNumber')) {
      params = params.append('pageNumber', this.isResetPaging ? '1' : (this.paging ? this.paging.pageNumber.toString() : '1'))
        .append('pageSize', this.paging ? this.paging.pageSize.toString() : this.config.PAGE_SIZE.toString());
    }
    return params;
  }

  _fillData(nativeUrl: string, params: HttpParams, baseUrl?: string) {
    params = this.updateHttpParams(params);
    this.apiService.get<Page>(nativeUrl, params, baseUrl).subscribe(this.afterFillData);
  }

  _fillDataByPostMethod(nativeUrl: string, obj: any, options: { headers?: HttpHeaders, params: HttpParams }, baseUrl?: string) {
    options.params = this.updateHttpParams(options.params);
    this.apiService.post(nativeUrl, obj, options, baseUrl).subscribe(this.afterFillData);
  }

  pagingChange(event: Paging) {
    if (this.paging) {
      this.paging = event;
      this.search();
    } else {
      this.paging = event;
    }
  }

  onClick(event: ButtonClickModel) {
    // Form extends will be override custom by business
  }

  onSuccessFunc = (data: any, onSuccessMessage?: string): void => {
    this.utilsService.onSuccessFunc(onSuccessMessage ? onSuccessMessage : 'common.default.success');
    this.search();
  };

  resetSearchFormValue() {
    if (!this.searchForm) {
      return;
    }
    for (const ctrName in this.searchForm.controls) {
      this.searchForm.controls[ctrName].setValue('');
    }
  }

  toggleAdvancedSearch() {
    this.isAdvancedSearch = !this.isAdvancedSearch;
  }

}
