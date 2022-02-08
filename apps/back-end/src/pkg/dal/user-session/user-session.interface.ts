import { IBase } from '../base/base.interface';
import { IUser } from '../user/user.interface';

export interface IUserSession extends IBase {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
