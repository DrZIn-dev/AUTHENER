import { IBase } from '../base/base.interface';
import { IUserRole } from '../user-role/user-role.interface';
import { IUserSession } from '../user-session/user-session.interface';

export interface IUser extends IBase {
  username: string;
  email: string;
  password: string;
  userSessions: IUserSession[];
  userRoles: IUserRole[];
  issuer: IUser;
}
