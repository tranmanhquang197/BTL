import {
  ApiService,
  ColumnFields,
  DateUtilService, FlatTreeConfigConvertObject,
  FlatTreeNode,
  NsCustomDialogDataConfig,
  SelectModel,
  SuperEntity,
  TreeFields,
  UtilsService
} from '@next-solutions/next-solutions-base';
import {CountryLocation} from '../../_models/dcommerce/country.location.model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Kpi} from '../../_models/kpi/kpi.model';
import {Policy} from '../../_models/policy/policy.model';
import {HttpParams} from '@angular/common/http';
import {Promotion} from "../../_models/promotion/promotion.model";
import {MatDialogConfig} from "@angular/material/dialog";
import {QuillModules, QuillToolbarConfig} from "ngx-quill/lib/quill-editor.interfaces";

export class CommonUtils {

  static childLevel = 0;

  static isEmptyList(list: any) {
    return !list || (Array.isArray(list) && list.length === 0);
  }

  static isNullOrUndefinedOrBlankValue(value: any) {
    return value === null || value === undefined || value === '';
  }

  static hasDistributor() {
    // biến này sử dụng trong tích hợp mStore
    const distributorUser = JSON.parse(window.sessionStorage.getItem('user') + '') as any;
    return !!window.sessionStorage.getItem('distributorCode') || (!!distributorUser && !!distributorUser.distributorCode);
  }

  static getDistributorCode(): string {
    // biến này sử dụng trong tích hợp mStore
    const distributorUser = JSON.parse(window.sessionStorage.getItem('user') + '') as any;
    return distributorUser && distributorUser.distributorCode ? distributorUser.distributorCode : window.sessionStorage.getItem('distributorCode') ? window.sessionStorage.getItem('distributorCode') + '' : '';
  }

  static getDistributorName(): string {
    // biến này sử dụng trong tích hợp mStore
    const distributorUser = JSON.parse(window.sessionStorage.getItem('user') + '') as any;
    return distributorUser && distributorUser.distributorName ? distributorUser.distributorName : window.sessionStorage.getItem('distributorName') ? window.sessionStorage.getItem('distributorName') + '' : '';
  }

  static getTownshipRecursive(children: FlatTreeNode[], townships: string[] | FlatTreeNode[] | any[], isGetFullData?: boolean) {
    if (!Array.isArray(children)) {
      return;
    }
    for (const child of children) {
      if (Array.isArray(child.children) && child.children.length > 0) {
        this.getTownshipRecursive(child.children, townships, isGetFullData);
      } else {
        if (!!isGetFullData) {
          townships.push(child);
        } else {
          townships.push(child.value);
        }

      }
    }

  }

  static getPromotionTownships(region: string, district: string, township: string,
                               selected: {
                                 selectedDistrict?: FlatTreeNode,
                                 selectedRegion?: FlatTreeNode
                               }) {
    if (!region) {
      return '';
    }
    if (township) {
      return [township];
    }
    if (district) {
      const townships: string[] = [];
      if (selected.selectedDistrict?.children) {
        this.getTownshipRecursive(selected.selectedDistrict?.children, townships);
        return townships;
      }
    }
    if (region) {
      const townships: string[] = [];
      if (selected.selectedRegion?.children) {
        this.getTownshipRecursive(selected.selectedRegion?.children, townships);
        return townships;
      }
    }

    return [];

  }

  static getPosition(e: any, arr: any[]) {
    return !!arr && arr.length > 0 ? (arr.indexOf(e) + 1).toString() : '';
  }

  static convertFlatTreeToFlatMap(list: FlatTreeNode[], flatMap: Map<any, any>) {
    if (!list) {
      return;
    }
    for (const node of list) {
      if (node.children && node.children.length > 0) {
        this.convertFlatTreeToFlatMap(node.children, flatMap);
      } else {
        flatMap.set(node.value, node);
      }
    }
  }

  static setDisplayTreeConfig(treeConfig: FlatTreeConfigConvertObject, source: FlatTreeNode[], flatTreeDisplayValue: string[], isDynamicConfig?: boolean) {
    this.checkAvailableCondition(source, flatTreeDisplayValue);
    treeConfig.display = (e: FlatTreeNode) => !!e._displayFuncInput;
    if (isDynamicConfig) {
      treeConfig.isDynamicConfig = isDynamicConfig;
    }

  }

  static checkAvailableCondition(children: FlatTreeNode[], conditionList: string[]) {
    for (const child of children) {
      if (child.children && child.children.length > 0) {
        this.checkAvailableCondition(child.children, conditionList);
        child._displayFuncInput = child.children.some(e => e._displayFuncInput);
      } else if (!child.children || child.children.length === 0) {
        child._displayFuncInput = conditionList.includes(child.value)
      }
    }
  }

  static file2Url(lstFile: any, type: string) {
    console.log('listfffffffffffffffffffffff', lstFile)
    if (!lstFile || lstFile.length === 0) {
      return {};
    }
    const url = lstFile[0].url;
    const id = lstFile[0].id;
    const name = url ? url.split('/').pop() : '';
    // console.log('getFileeeeeeeeeeeeeee',lstFile, {name, url, type})
    return {id, name, url: lstFile, type};
  }

  static prepareTownshipData(data: any): SelectModel[] {
    if (!data) {
      return [];
    }
    if (data.content) {
      data = data.content;
    }
    const treeFields: TreeFields = {
      rootData: data,
      value: (node: CountryLocation) => `${node.code}`,
      display: (node: CountryLocation) => {
        // if (node.hasOwnProperty('isocode')) {
        //   return (node as Country).isocode;
        // }
        const name = node.name ? node.code + ' - ' + node.name : node.code;
        return name ? name : '';
      },
      children: (node: CountryLocation) => node.children ? node.children : [],
    };

    return this.convertTreeDataToAutocompleteData(
      treeFields, ' >> ', (_: number, node: any): boolean => {
        if (treeFields && treeFields.children) {
          const children = treeFields.children(node);
          return children && children.length > 0;
        }
        return false;
      }, treeFields.rootData, null, null);
  }

  static convertTreeDataToAutocompleteData(treeFields: TreeFields,
                                           symbol: string,
                                           hasChildFn: (_: number, node: any) => boolean,
                                           nodes: SuperEntity[],
                                           prefixValue: string | null,
                                           prefixDisplayValue: string | null): SelectModel[] {
    const result: SelectModel[] = [];
    if (treeFields) {
      for (const node of nodes) {
        const value = treeFields.value(node).toString();
        const displayValue = prefixDisplayValue ? prefixDisplayValue + symbol + treeFields.display(node) : treeFields.display(node);
        const hasChild = hasChildFn(0, node);
        if (hasChild) {
          this.childLevel++;
          const childen = treeFields.children(node);
          result.push(...this.convertTreeDataToAutocompleteData(treeFields, symbol, hasChildFn, childen, value, displayValue));
          this.childLevel--;
        } else if (this.childLevel === 3) {
          result.push(new SelectModel(value, displayValue, hasChild, node));
        }
      }
    }
    return result;
  }

  static isMFCDistributor(distributorCodes: string[] | FlatTreeNode[] | undefined): boolean {
    if (distributorCodes)
      return distributorCodes && distributorCodes.length === 1
        && (distributorCodes[0] === environment.MFC_CODE || (typeof distributorCodes[0] === 'object' ? distributorCodes[0]?.value === environment.MFC_CODE : false));
    return false;
  }

  static clearPropertyValueOfObject(properties: string[], obj: object, except: string[]): any {
    for (const key in obj) {

      if (except.includes(key.toString())) {
        continue;
      }
      if (properties.includes(key.toString())) {
        obj[key] = null;
        continue;
      }
      if (obj[key] instanceof Array) {
        for (const element of obj[key]) {
          CommonUtils.clearPropertyValueOfObject(properties, element, except);
        }
      } else if (obj[key] instanceof Object) {
        CommonUtils.clearPropertyValueOfObject(properties, obj[key], except);
      }
    }
    return obj;
  }

  static isExpired(dateUtilService: DateUtilService, toDateString?: string): boolean {
    if (toDateString) {
      const nowDate = dateUtilService.getDateNow();
      const toDate = dateUtilService.convertStringToDate(toDateString.replace('Z', ''));
      return toDate.getTime() < nowDate.getTime();
    }
    return false;
  }

  static isBeingActivated(dateUtilService: DateUtilService, obj: Kpi | Policy | Promotion) {
    // bat buoc phai co toDate voi Kpi va Policy
    if (!!obj && !!obj.fromDate && !!obj.toDate) {
      const nowDate = dateUtilService.getDateNow();
      const fromDate = dateUtilService.convertStringToDate(obj.fromDate.replace('Z', ''));
      const toDate = obj.toDate ? dateUtilService.convertStringToDate(obj.toDate.replace('Z', '')) : new Date(9999, 12, 31);
      return fromDate.getTime() <= nowDate.getTime() && nowDate.getTime() <= toDate.getTime();
    }
    return false;
  }

  static isBeingSoon(dateUtilService: DateUtilService, fromDateString: string | undefined | null): boolean {
    if (fromDateString) {
      const nowDate = dateUtilService.getDateNow();
      const fromDate = dateUtilService.convertStringToDate(fromDateString.replace('Z', ''));
      return nowDate.getTime() < fromDate.getTime();
    }
    return false;
  }

  static customExecuteErrorHandle(utilsService: UtilsService,
                                  method: () => Observable<any>,
                                  onSuccessFunc: (this: void, d: any, onSuccessMessage?: string) => void,
                                  onSuccessMessage: string,
                                  confirmMsg: string,
                                  confirmMsgParamsFormat: string[] = [],
                                  onErrorFunc: (err: any) => void,
                                  dialogConfig?: MatDialogConfig<NsCustomDialogDataConfig>,
                                  confirmDialogButtonOk: string = 'common.OK', confirmDialogButtonCancel: string = 'common.Cancel',
  ) {
    utilsService.showConfirmDialog(confirmMsg, confirmMsgParamsFormat, '', [], dialogConfig,
      confirmDialogButtonOk, confirmDialogButtonCancel)
      .afterClosed().subscribe(result => {
      if (result && result.value) {
        method().subscribe((data: any) => {
          onSuccessFunc(data, onSuccessMessage);
        }, error1 => {
          if (error1 !== '401') {
            onErrorFunc(error1);
          }
        });
      }
    });
  }

  static createPackageCrawDataPromise(apiService: ApiService, clientId: string | undefined) {
    const packageParams = new HttpParams()
      .set('clientId', clientId ? clientId : '')
      .set('status', 'ACCEPTED')
      .set('pageNumber', '1')
      .set('pageSize', '9999');
    return apiService.get('/packages', packageParams, environment.BASE_BILLING_URL).toPromise().then(res => ({
      data: res,
      key: 'package'
    }));
  }

  static createLevelCrawDataPromise(apiService: ApiService, clientId: string | undefined) {
    const levelParams = new HttpParams()
      .set('clientId', clientId ? clientId : '')
      .set('status', 'ACCEPTED')
      .set('pageNumber', '1')
      .set('pageSize', '9999');
    return apiService.get('/levels', levelParams, environment.BASE_BILLING_URL).toPromise().then(res => ({
      data: res,
      key: 'level'
    }));
  }

  static createSegmentCrawDataPromise(apiService: ApiService, clientId: string | undefined) {
    const segmentParams = new HttpParams()
      .set('clientId', clientId ? clientId : '')
      .set('status', 'ACCEPTED')
      .set('pageNumber', '1')
      .set('pageSize', '9999');
    return apiService.get('/segments', segmentParams, environment.BASE_BILLING_URL).toPromise().then(res => ({
      data: res,
      key: 'segment'
    }));
  }

  static createSegmentApiObservable(apiService: ApiService, clientId: string | undefined): Observable<any> {
    const segmentParams = new HttpParams()
      .set('clientId', clientId ? clientId : '')
      .set('status', 'ACCEPTED')
      .set('pageNumber', '1')
      .set('pageSize', '9999');
    return apiService.get('/segments', segmentParams, environment.BASE_BILLING_URL);
  }

  static createTreePackApiObservable(apiService: ApiService): Observable<any> {
    return apiService.get('/categories/tree-pack',
      new HttpParams(), environment.BASE_DCOMMERCE_URL)
  }

  static createLocationTreeApiObservable(apiService: ApiService): Observable<any> {
    return apiService.get('/countries/locations/flat-tree-node',
      new HttpParams(), environment.BASE_LOGISTICS_URL)
  }

  static getTotalFooterColspanDynamic(columns: ColumnFields[], dataTable: any[],
                                      exceptColumns: string[]) {
    let display = false;
    return columns.filter(col => !exceptColumns.includes(col.columnDef))
      .reduce((colspan, col) => {
        display = false;
        dataTable.forEach(row => {
          display = display || !!(typeof (col.display) === 'function' ? col.display(row) : col.display);
        });
        return colspan + (display ? 1 : 0);
      }, 0)
  }

  static createQuillModuleIgnoreImage(): QuillModules {
    return {
      toolbar: {
        container: [
          [{font: []}],
          [{size: ['small', false, 'large', 'huge']}],
          ['bold', 'italic', 'underline', 'strike'],
          [{header: 1}, {header: 2}],
          [{color: []}, {background: []}],
          [{list: 'ordered'}, {list: 'bullet'}],
          [{align: []}],
          ['link'/*, 'image'*/],
        ],
      },
      // imageResize: true,
    };
  }

  static createQuillModuleWithImage(): QuillModules {
    return {
      toolbar: {
        container: [
          [{font: []}],
          [{size: ['small', false, 'large', 'huge']}],
          ['bold', 'italic', 'underline', 'strike'],
          [{header: 1}, {header: 2}],
          [{color: []}, {background: []}],
          [{list: 'ordered'}, {list: 'bullet'}],
          [{align: []}],
          ['link', 'image'],
        ] as QuillToolbarConfig,
      },
      imageResize: true,
    } as QuillModules;
  }

  static isChangeCodesChange(lastestCodesChange: string[] | undefined, newCodes: string[]) {
    if (!lastestCodesChange || lastestCodesChange.length !== newCodes.length) {
      return true;
    }
    return lastestCodesChange.reduce((checkDuplicate, code) => {
      return checkDuplicate || !newCodes.some(newCode => code === newCode);
    }, false);
  }
}
