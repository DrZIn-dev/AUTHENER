import { PickType } from '@nestjs/swagger';
import { UserSessionEntity } from '../pkg/dal/user-session/user-session.entity';
import { UserEntity } from '../pkg/dal/user/user.entity';

export class SignUpDto extends PickType(UserEntity, [
  'username',
  'email',
  'password',
] as const) {}

export class SignInDto extends PickType(UserEntity, [
  'username',
  'password',
] as const) {}

export class SessionDto extends PickType(UserSessionEntity, [
  'accessToken',
  'refreshToken',
] as const) {}
