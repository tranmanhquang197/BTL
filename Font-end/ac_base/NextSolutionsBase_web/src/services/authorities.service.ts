import { OAuth2AuthenticationDto } from '../models/oauth/oAuth2AuthenticationDto';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthoritiesService {

  me: OAuth2AuthenticationDto | null = null;
  stateMe: BehaviorSubject<OAuth2AuthenticationDto> = new BehaviorSubject<OAuth2AuthenticationDto>(new OAuth2AuthenticationDto());
  me$: Observable<OAuth2AuthenticationDto> = this.stateMe.asObservable();

  hasAuthorities(authorities: string[]) {
    if (!authorities) {
      return false;
    }
    let checkAuthority = false;
    for (const authority of authorities) {
      checkAuthority = checkAuthority || this.hasAuthority(authority.toLowerCase());
      if (checkAuthority) {
        break;
      }
    }
    return checkAuthority;
  }

  hasAuthority(authority: string): boolean {
    if (!authority || !this.me || !this.me.authorities) {
      return false;
    }
    return this.me.authorities.map(x => x.authority.toString().toLowerCase()).includes(authority.toLowerCase());
  }
}
