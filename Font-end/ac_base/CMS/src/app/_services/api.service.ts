import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { Page } from '@next-solutions/next-solutions-base';


@Injectable()
export class ApiService {

  constructor(private http: HttpClient) {
  }

  getFullUrl(url: string) {
    return environment.BASE_URL + url;
  }

  get(nativeUrl: string, params: HttpParams) {
    return this.http.get(this.getFullUrl(nativeUrl), {params});
  }

  getPaging(nativeUrl: string, params: HttpParams) {
    return this.http.get<Page>(this.getFullUrl(nativeUrl), {params});
  }

  post(nativeUrl: string, obj: any) {
    return this.http.post(this.getFullUrl(nativeUrl), obj);
  }

  patch(nativeUrl: string, obj: any) {
    return this.http.patch(this.getFullUrl(nativeUrl), obj);
  }

  delete(nativeUrl: string) {
    return this.http.delete(this.getFullUrl(nativeUrl));
  }

  getJSON(file: string): Observable<any> {
    return this.http.get(file);
  }

  getAllClientId(nativeUrl: string) {
    return this.http.get(this.getFullUrl(nativeUrl));
  }
}
