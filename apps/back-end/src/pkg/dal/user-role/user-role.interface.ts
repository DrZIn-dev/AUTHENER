import { IBase } from '../base/base.interface';
import { IUser } from '../user/user.interface';

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  MAINTAINER = 'MAINTAINER',
  USER = 'USER',
}

export interface IUserRole extends IBase {
  role: USER_ROLE;
  user: IUser;
}
