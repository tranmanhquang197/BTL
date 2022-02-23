import { UserAuthentication } from './user.authentication';
import { Authority } from './authority';

export class OAuth2AuthenticationDto {
  userAuthentication: UserAuthentication | null = null;
  authorities: Authority[] | null = null;
  name: string | null = null;
}

