import { RoleModel } from '@next-solutions/next-solutions-base';

export class UserModel {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  roles: RoleModel[] = [];
}
