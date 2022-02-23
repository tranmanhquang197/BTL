import {Observable, of} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ApiService} from '@next-solutions/next-solutions-base';
import {Injectable} from '@angular/core';

@Injectable()
export class SharedService {
  constructor(protected apiService: ApiService) {
  }

  getAllClientIds(): Observable<string[]> {
    if (!!environment.DEFAULT_CLIENT_ID) {
      return of([environment.DEFAULT_CLIENT_ID + '']);
    }
    const params = new HttpParams()
      .set('filterShowOnClient', environment.CLIENT_ID);
    return this.apiService.get<string[]>('/oauthClient/getClientIds', params, environment.BASE_AUTHORIZATION_URL);
  }
}
