import { RoleModel } from '../role.model';

export class Principal {
  username: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  roles: RoleModel[] | null = [];
  mustChangePassword: boolean | undefined | null;
  attemptLoginFailed: number | undefined | null = 0;
  enabled: boolean = true;
}
