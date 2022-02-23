import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OAuth2AuthenticationDto } from '../models/oauth/oAuth2AuthenticationDto';
import { AuthoritiesService } from './authorities.service';
import { InjectTokenNextSolutionsConfig, NextSolutionsConfig } from '../modules/next.solutions.config';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class AuthoritiesResolverService implements Resolve<Observable<OAuth2AuthenticationDto>> {

  config: NextSolutionsConfig;

  constructor(protected authoritiesService: AuthoritiesService,
              protected injector: Injector,
              protected apiService: ApiService) {
    this.config = injector.get(InjectTokenNextSolutionsConfig);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<OAuth2AuthenticationDto>
    | Observable<Observable<OAuth2AuthenticationDto>>
    | Promise<Observable<OAuth2AuthenticationDto>> {
    return !!this.authoritiesService.me && !!this.authoritiesService.me.userAuthentication ? of(this.authoritiesService.me)
      : this.apiService.get<OAuth2AuthenticationDto>('/user/me', new HttpParams(), this.config.BASE_AUTHORIZATION_URL);
  }
}