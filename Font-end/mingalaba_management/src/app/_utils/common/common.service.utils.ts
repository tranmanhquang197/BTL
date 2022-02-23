import {ApiService} from "@next-solutions/next-solutions-base";
import {HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

export class CommonServiceUtils {
  static getInventoryObservable(apiService: ApiService, productPackingCodes: string[], townshipCodes: string[]): Observable<any> {
    if (!productPackingCodes) {
      productPackingCodes = [];
    }
    if (!townshipCodes) {
      townshipCodes = [];
    }
    const availableQuantityFilterDto = {
      productPackingCodes,
      townshipCodes
    }
    return apiService.post('/stores/m-store/available-quantity', availableQuantityFilterDto, undefined, environment.BASE_LOGISTICS_URL);
  }
}
