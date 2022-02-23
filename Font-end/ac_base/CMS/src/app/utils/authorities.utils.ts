import {environment} from '../../environments/environment';

export class AuthoritiesUtils {
  static hasAuthority(authority: string): boolean {
    if (!authority) {
      return false;
    }
    return environment.me && environment.me.authorities
      ? environment.me.authorities.map(x => x.authority.toLowerCase()).includes(authority.toLowerCase())
      : false;
  }
}
